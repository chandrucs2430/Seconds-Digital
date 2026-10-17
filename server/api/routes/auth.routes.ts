import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller.ts';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;