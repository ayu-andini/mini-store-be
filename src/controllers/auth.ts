import { Request, Response } from "express";
import { registerSupplier, loginSupplier } from "../services/auth";
import { loginSchema, registerSchema } from "../validations/auth";

export async function handleRegister(req: Request, res: Response) {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const { email, password } = req.body;
        const supplier = await registerSupplier(email, password);
        res.status(201).json({ message: "Supplier registered", supplier });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

export async function handleLogin(req: Request, res: Response) {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const { email, password } = req.body;
        const result = await loginSupplier(email, password);
        res.json({ message: "Login success", ...result });
    } catch (err: any) {
        res.status(401).json({ message: err.message });
    }
}