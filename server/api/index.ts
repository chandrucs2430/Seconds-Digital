import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { db } from './prisma/db.ts'; 
import authRoutes from './routes/auth.routes.ts';
import shopRoutes from './routes/shop.routes.ts';

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); 

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: "error", message: "Too many requests" }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: "error", message: "Too many login attempts. Try again in 15 minutes." }
});

app.use('/api/', apiLimiter);

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', message: 'Database connected securely' });
  } catch (error) {
    console.error('[Health Check] DB Error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/shop', shopRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error]:', err.message);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Enterprise Server running securely on http://localhost:${PORT}`);
});