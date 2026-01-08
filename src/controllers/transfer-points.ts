import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import AppError from "../utils/app-error";

export const transferPoints = async (req: Request, res: Response) => {
    const { senderId, receiverId, amount } = req.body;

    try {
        // 1. Cek user existence (sebelum transaction)
        const [senderExists, receiverExists] = await Promise.all([
        prisma.user.findUnique({ where: { id: senderId } }),
        prisma.user.findUnique({ where: { id: receiverId } }),
        ]);

        // if (!senderExists) {
        // return res.status(404).json({
        //     success: false,
        //     message: "Pengirim tidak ditemukan",
        // }); }

        // fokus logic saja
        if (!senderExists ){ throw new AppError("Sender not found", 404); }
        if (!receiverExists ){ throw new AppError("Receiver not found", 404); }

        // 2. Transaction (atomic)
        await prisma.$transaction(async (tx) => {
        const sender = await tx.user.update({
            where: { id: senderId },
            data: { points: { decrement: amount } },
        });

        // 3. Validasi saldo di DALAM transaction
        if (sender.points < 0) {
            throw new Error("Poin pengirim tidak mencukupi");
        }

        await tx.user.update({
            where: { id: receiverId },
            data: { points: { increment: amount } },
        });
        });

        // 4. Response sukses
        res.status(200).json({
        success: true,
        message: "Transfer poin berhasil",
        });

    } catch (error: any) {
        res.status(400).json({
        success: false,
        message: error.message || "Transfer gagal",
        });
    }
};

// export const transferPoints = async (
//     req: Request, res: Response, next: any
// ) => {
//     const { senderId, receiverId, amount } = req.body;

//     try {
//         const [sender, receiver] = await Promise.all([
//             prisma.user.findUnique({where: { id: senderId }}),
//             prisma.user.findUnique({where: { id: receiverId }})
//         ])

//         if (!sender) {
//             return res.status(400).json({
//             success: false,
//             message: "Pengirim tidak ditemukan",
//         });
//         } else if (!receiver) {
//             return res.status(400).json({
//             success: false,
//             message: "Penerima tidak ditemukan",
//         });
//         } else if (sender.points < amount){
//             return res.status(400).json({
//             success: false,
//             message: "Poin tidak mencukupi",
//         });
//         }

//         await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
//         await tx.user.update({
//             where: { id: senderId },
//             data: { points: { decrement: amount } },
//         })
//         await tx.user.update({
//             where: { id: receiverId },
//             data: { points: { increment: amount } },
//         })

//         });
//         res.status(200).json({ success: true, message: "Transfer poin berhasil" });

//     } catch (error) {
//         res.status(200).json({ success: true, message: "Internal server error" });
//     }
// };

export const getUserPoints = async (
    req: Request, res: Response, next: any ) => {
    try {
        const userId = Number(req.params.id);
        const userPoints = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, points: true },
        });

        // cek hasil query
        if (!userPoints ){ throw new AppError("User not found", 404); }

        // jika ditemukan
        res.status(200).json({
            message: "Data poin user ditemukan",
            data: userPoints});

    } catch (error) {
        next(error);
    }
};