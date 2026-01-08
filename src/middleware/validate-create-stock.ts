// import { Request, Response, NextFunction } from 'express';
// import AppError from '../utils/app-error';

// export const validateCreateStock = (req: Request, res: Response, next: NextFunction) => {
//   const { productId, supplierId, quantity } = req.body;

//   if (typeof productId !== 'number' || typeof supplierId !== 'number' || typeof quantity !== 'number') {
//     return next(new AppError('Invalid stock item: "productId", "supplierId", and "quantity" must be numbers.', 400));
//   }

//   if (quantity < 0) {
//     return next(new AppError('Invalid stock item: "quantity" cannot be negative.', 400));
//   }

//   next();
// };
