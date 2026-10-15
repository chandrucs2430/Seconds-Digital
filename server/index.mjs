import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function ensureWritableDirectory(directory, fallbackSubdir) {
  try {
    fs.mkdirSync(directory, { recursive: true });
    fs.accessSync(directory, fs.constants.W_OK);
    return directory;
  } catch {
    const fallbackDirectory = path.join(os.tmpdir(), 'seconds-digital-website', fallbackSubdir);
    fs.mkdirSync(fallbackDirectory, { recursive: true });
    return fallbackDirectory;
  }
}

const dataDir = ensureWritableDirectory(path.join(rootDir, 'data'), 'data');
const uploadDir = ensureWritableDirectory(path.join(rootDir, 'public', 'uploads'), 'uploads');
const envFile = path.join(rootDir, '.env');

// Load env vars (TODO: switch to dotenv package later, this regex is sketchy)
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const port = Number(process.env.API_PORT || 8787);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET missing or too short. Check your .env file!');
}

// TODO: Need to migrate to PostgreSQL before prod deployment. SQLite locks up too easily on concurrent writes.
const db = new Database(path.join(dataDir, 'seconds-digital.sqlite'));
// console.log("DB Path ->", path.join(dataDir, 'seconds-digital.sqlite'));

db.pragma('foreign_keys = ON');

// FIXME: Need to add proper indexes to these tables when data gets larger
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL CHECK (price >= 0),
    original_price INTEGER CHECK (original_price IS NULL OR original_price >= price),
    image TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Uncategorized',
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    district TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0)
  );
  CREATE TABLE IF NOT EXISTS visitor_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(uploadDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  // bumped to 5mb because users keep trying to upload raw 4K camera photos smh
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});

function issueSession(res, admin) {
  const token = jwt.sign({ sub: admin.id, role: 'admin', email: admin.email }, jwtSecret, { expiresIn: '8h' });
  res.cookie('admin_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
}

function requireAdmin(req, res, next) {
  const token = req.cookies.admin_session;
  // console.log("Auth check - token exists:", !!token);
  
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    req.admin = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    res.clearCookie('admin_session');
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

function validateProduct(input) {
  const product = {
    name: String(input.name || '').trim(),
    description: String(input.description || '').trim(),
    price: Number(input.price),
    original_price: input.original_price === '' || input.original_price == null ? null : Number(input.original_price),
    image: String(input.image || '').trim(),
    category: String(input.category || 'Uncategorized').trim(),
    stock_quantity: Number(input.stock_quantity ?? 0),
  };
  
  if (!product.name || !Number.isInteger(product.price) || product.price < 0 || (product.original_price !== null && (!Number.isInteger(product.original_price) || product.original_price < product.price)) || !Number.isInteger(product.stock_quantity) || product.stock_quantity < 0) {
    return { error: 'Name, integer prices, and a non-negative integer stock quantity are required.' };
  }
  return { product };
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/visitor-events', (req, res) => {
  db.prepare('INSERT INTO visitor_events (path) VALUES (?)').run(String(req.body.path || '/').slice(0, 200));
  res.status(201).json({ ok: true });
});

app.post('/api/admin/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  
  // console.log("Login attempt -->", email);

  const admin = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }
  
  issueSession(res, admin);
  res.json({ admin: { id: admin.id, email: admin.email } });
});

app.post('/api/admin/auth/logout', (_req, res) => { 
  res.clearCookie('admin_session'); 
  res.status(204).end(); 
});

app.get('/api/admin/auth/me', requireAdmin, (req, res) => res.json({ admin: { id: req.admin.sub, email: req.admin.email } }));

app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
  const revenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS value FROM orders WHERE status != 'cancelled'").get().value;
  const orders = db.prepare('SELECT COUNT(*) AS value FROM orders').get().value;
  const users = db.prepare('SELECT COUNT(*) AS value FROM users').get().value;
  const products = db.prepare("SELECT COUNT(*) AS value FROM products WHERE status = 'active'").get().value;
  const status = db.prepare('SELECT status, COUNT(*) AS count FROM orders GROUP BY status').all();
  
  // kinda messy query but it works for now
  const recentOrders = db.prepare(`SELECT orders.id, orders.total_amount, orders.status, orders.payment_status, orders.created_at, users.full_name, users.email FROM orders LEFT JOIN users ON users.id = orders.user_id ORDER BY orders.created_at DESC LIMIT 10`).all();
  
  res.json({ metrics: { revenue, orders, users, products, visitors: db.prepare('SELECT COUNT(*) AS value FROM visitor_events').get().value }, status, recentOrders });
});

app.get('/api/admin/products', requireAdmin, (_req, res) => res.json({ products: db.prepare("SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC").all() }));

app.post('/api/admin/products', requireAdmin, (req, res) => {
  const result = validateProduct(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  
  const { product } = result;
  const dbInfo = db.prepare('INSERT INTO products (name, description, price, original_price, image, category, stock_quantity) VALUES (@name, @description, @price, @original_price, @image, @category, @stock_quantity)').run(product);
  
  res.status(201).json({ product: db.prepare('SELECT * FROM products WHERE id = ?').get(dbInfo.lastInsertRowid) });
});

app.patch('/api/admin/products/:id', requireAdmin, (req, res) => {
  const result = validateProduct(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  
  const { product } = result;
  const dbInfo = db.prepare('UPDATE products SET name=@name, description=@description, price=@price, original_price=@original_price, image=@image, category=@category, stock_quantity=@stock_quantity, updated_at=CURRENT_TIMESTAMP WHERE id=@id AND status=\'active\'').run({ ...product, id: Number(req.params.id) });
  
  if (!dbInfo.changes) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product: db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) });
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const dbInfo = db.prepare("UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'active'").run(Number(req.params.id));
  if (!dbInfo.changes) return res.status(404).json({ error: 'Product not found.' });
  res.status(204).end();
});

app.post('/api/admin/uploads', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images up to 5MB are accepted.' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.get('/api/admin/orders', requireAdmin, (_req, res) => res.json({ orders: db.prepare('SELECT orders.*, users.full_name, users.email, users.phone FROM orders LEFT JOIN users ON users.id = orders.user_id ORDER BY orders.created_at DESC').all() }));
app.get('/api/admin/users', requireAdmin, (_req, res) => res.json({ users: db.prepare('SELECT users.*, COUNT(orders.id) AS order_count FROM users LEFT JOIN orders ON orders.user_id = users.id GROUP BY users.id ORDER BY users.created_at DESC').all() }));

// Fallback error handler
app.use((error, _req, res, _next) => {
  console.error("Fatal route error:", error);
  res.status(500).json({ error: 'Unexpected server error.' });
});

// Admin bootstrap
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

if (adminEmail && adminPassword) {
  const existing = db.prepare('SELECT id, password_hash FROM admin_users WHERE email = ?').get(adminEmail);

  if (!existing) {
    db.prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)').run(adminEmail, await bcrypt.hash(adminPassword, 12));
    // console.log("Created default admin user");
  } else {
    const passwordMatches = await bcrypt.compare(adminPassword, existing.password_hash);
    if (!passwordMatches) {
      db.prepare('UPDATE admin_users SET password_hash = ? WHERE email = ?').run(await bcrypt.hash(adminPassword, 12), adminEmail);
      // console.log("Updated admin password from environment settings");
    }
  }
}

app.listen(port, () => console.log(`API listening on port ${port}`));