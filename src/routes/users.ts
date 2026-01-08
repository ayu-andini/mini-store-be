import express from "express";
import { transferPoints, getUserPoints } from "../controllers/transfer-points";
import { validateTransfer } from '../middleware/validate-transfer';
import { getAllUsers } from "../controllers/users";

const router = express.Router();

router.get("/users", getAllUsers);

router.post("/users/transfer-points", validateTransfer, transferPoints );
router.get("/user/points/:id", getUserPoints);

export default router;
