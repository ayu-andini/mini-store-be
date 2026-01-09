import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";
import { encrypt, decrypt } from "../utils/encryption";
import AppError from "../utils/app-error";

export async function registerSupplier(email: string, password: string) {
    const encryptedEmail = encrypt(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const supplier = await prisma.supplier.create({
        data: {
            email: encryptedEmail,
            password: hashedPassword,
        },
    });

    return { id: supplier.id, email: email };
}

export async function loginSupplier(email: string, password: string) {
    const suppliers = await prisma.supplier.findMany();

    let supplierFound = null;
    for (const s of suppliers) {
        if (decrypt(s.email) === email) {
            supplierFound = s;
            break;
        }
    }

    if (!supplierFound || !(await bcrypt.compare(password, supplierFound.password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    const token = signToken({ id: supplierFound.id, email: email });
    return { token };
}