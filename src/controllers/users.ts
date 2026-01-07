import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getAllUsers = async (req: Request, res:Response)=>{
    try {
        const users = await prisma.user.findMany()
        res.status(200).json({message:"Successfully retrieved all users.", data: users})
    } catch (error) {
        res.status(500).json({error: "failed to get users"})
    }
} 