import { Router } from 'express';
import { handleRegister, handleLogin } from '../controllers/auth';

const router = Router();

// Supplier routes (as per user's latest instruction)
router.post('/register', handleRegister);
router.post('/login', handleLogin);

export default router;
