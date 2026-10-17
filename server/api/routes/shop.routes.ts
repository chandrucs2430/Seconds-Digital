import { Router } from 'express';
import { getProducts, createProduct, createOrder, getMyOrders } from '../controllers/shop.controller.ts';
import { requireAuth } from '../middlewares/auth.middleware.ts';

const router = Router();

// Public route (anyone can view products)
router.get('/products', getProducts);

// Protected routes (requires valid JWT token)
router.post('/products', requireAuth, createProduct);
router.post('/orders', requireAuth, createOrder);
router.get('/orders/me', requireAuth, getMyOrders);

export default router;