import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app-error';

export const validateStockUpdate = (req: Request, res: Response, next: NextFunction) => {
  let { stocks, productId, supplierId, quantity } = req.body;

  // jika client kirim single object
  if (!stocks && productId && supplierId && typeof quantity === 'number') {
    req.body.stocks = [
      { productId, supplierId, quantity }
    ];
    stocks = req.body.stocks;
  }

  if (!Array.isArray(stocks) || stocks.length === 0) {
    return next(new AppError('Invalid input: "stocks" must be a non-empty array.', 400));
  }

  for (const stock of stocks) {
    if (
      typeof stock.productId !== 'number' ||
      typeof stock.supplierId !== 'number' ||
      typeof stock.quantity !== 'number'
    ) {
      return next(new AppError('Invalid stock item data type.', 400));
    }

    if (stock.quantity < 0) {
      return next(new AppError('Stock quantity cannot be negative.', 400));
    }
  }

  next();
};

// export const validateStockUpdate = (req: Request, res: Response, next: NextFunction) => {
//   const { stocks } = req.body;

//   if (!Array.isArray(stocks) || stocks.length === 0) {
//     return next(new AppError('Invalid input: "stocks" must be a non-empty array.', 400));
//   }

//   for (const stock of stocks) {
//     const { productId, supplierId, quantity } = stock;

//     if (typeof productId !== 'number' || typeof supplierId !== 'number' || typeof quantity !== 'number') {
//       return next(new AppError('Invalid stock item: "productId", "supplierId", and "quantity" must be numbers.', 400));
//     }

//     if (quantity < 0) {
//       return next(new AppError('Invalid stock item: "quantity" cannot be negative.', 400));
//     }
//   }

//   next();
// };
