import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import AppError from '../utils/app-error';

// Extend the Request type to include supplier property
declare module 'express-serve-static-core' {
  interface Request {
    supplier?: {
      id: number;
      email: string; // Add other supplier properties if needed
    };
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2. Verification token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // 3. Check if supplier still exists
    const currentSupplier = await prisma.supplier.findUnique({
      where: { id: decoded.id },
    });

    if (!currentSupplier) {
      return next(new AppError('The supplier belonging to this token no longer exists.', 401));
    }

    // 4. Grant access to protected route
    req.supplier = {
      id: currentSupplier.id,
      email: currentSupplier.email, // Assuming email is not decrypted here, or is just for display
    };
    next();
  } catch (error) {
    next(error);
  }
};