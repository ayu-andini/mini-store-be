import express from "express";
import { transferPoints, getUserPoints } from "../controllers/transfer-points";
import { validateTransfer } from '../middleware/validate-transfer';
import { getAllUsers } from "../controllers/users";
import { handleRegister, handleLogin } from '../controllers/auth';

const router = express.Router();

router.post('/supplier/register', handleRegister);
router.post('/supplier/login', handleLogin);

router.get("/users", getAllUsers);

router.post("/users/transfer-points", validateTransfer, transferPoints );
router.get("/user/points/:id", getUserPoints);

export default router;
