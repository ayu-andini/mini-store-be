import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";

// import { AppError } from "../utils/app-error";

export const transferPoints = async (
    req: Request, res: Response, next: any
) => {
    const { senderId, receiverId, amount } = req.body;

    try {
        // const sender = await prisma.user.findUnique({ where: { id: senderId } });
        // const receiver = await prisma.user.findUnique({
        // where: { id: receiverId },
        // });

        const [sender, receiver] = await Promise.all([
            prisma.user.findUnique({where: { id: senderId }}),
            prisma.user.findUnique({where: { id: receiverId }})
        ])

        if (!sender) {
            return res.status(400).json({
            success: false,
            message: "Pengirim tidak ditemukan",
        });
        } else if (!receiver) {
            return res.status(400).json({
            success: false,
            message: "Penerima tidak ditemukan",
        });
        } else if (sender.points < amount){
            return res.status(400).json({
            success: false,
            message: "Poin tidak mencukupi",
        });
        }

        // if (sender.points < amount) {
        //     return res.status(400).json({
        //     success: false,
        //     message: "Poin tidak mencukupi",
        // });
        // // throw new AppError("Poin tidak mencukupi", 400);
        // }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.user.update({
            where: { id: senderId },
            data: { points: { decrement: amount } },
        })
        await tx.user.update({
            where: { id: receiverId },
            data: { points: { increment: amount } },
        })

        // // Uncomment untuk testing rollback
        // throw new Error("Simulasi error");
        });
        res.status(200).json({ success: true, message: "Transfer poin berhasil" });

    } catch (error) {
        res.status(200).json({ success: true, message: "Internal server error" });
    }
};

export const getUserPoints = async (
    req: Request, res: Response, next: any ) => 
    {
    try {
        const userId = Number(req.params.id);
        const userPoints = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, points: true },
        });

//     if (!user) {
//       res.status(404).json({ error: "User tidak ditemukan" });
//       return;
//     }

    res.status(200).json({
        message: "Data poin user ditemukan",
        data: userPoints});

    } catch (error) {
        next(error);
    }
};