// middleware/validateTransfer.ts

import { Request, Response, NextFunction } from "express";

export const validateTransfer = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount) {
        return res.status(400).json({
        success: false,
        message: "senderId, receiverId, dan amount wajib diisi",
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
        success: false,
        message: "Amount harus lebih dari 0",
        });
    }

    next();
};
