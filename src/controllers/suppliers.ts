import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import AppError from '../utils/app-error';
import { Prisma } from '@prisma/client';

export const getStock = async (req: Request, res: Response) => {
  try {
        const stocks = await prisma.stock.findMany()
        res.json({message:"Showed All Data Stocks", data: stocks})
    } catch (error) {
        res.status(500).json({error: "failed to data stocks"})
    }
}

export const getSupplier = async (req: Request, res: Response) => {
  try {
        const suppliers = await prisma.supplier.findMany()
        res.json({message:"Showed All Data Suppliers", data: suppliers})
    } catch (error) {
        res.status(500).json({error: "failed to data suppliers"})
    }
}

export const createSupplier = async (req: Request, res: Response) => {
      try {
        const{ email } = req.body
        const supplier = await prisma.supplier.create({
            data:{ email },
        })
        // res.status(201).json(product)
        res.status(201).json({ message: "Added New Supplier", data: supplier })
        
    } catch (error) {
        res.status(500).json({error: "failed to create supplier"})
    }
};

// export const createStock = async (req: Request, res: Response, next: NextFunction) => {
//   const { productId, supplierId, quantity } = req.body;

//   try {
//     if (quantity < 0) {
//       throw new AppError('Stock quantity cannot be negative', 400);
//     }

//     const [product, supplier] = await Promise.all([
//       prisma.product.findUnique({ where: { id: productId } }),
//       prisma.supplier.findUnique({ where: { id: supplierId } }),
//     ]);

//     if (!product) {
//       throw new AppError(`Product with id ${productId} not found`, 404);
//     }

//     if (!supplier) {
//       throw new AppError(`Supplier with id ${supplierId} not found`, 404);
//     }

//     const newStock = await prisma.stock.create({
//       data: {
//         productId,
//         supplierId,
//         quantity,
//       },
//     });

//     res.status(201).json({
//       status: 'success',
//       data: {
//         stock: newStock,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  const { stocks } = req.body;

  try {
    const updatedStocks = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const results = [];
      for (const stock of stocks) {
        const { productId, supplierId, quantity } = stock;

        if (quantity < 0) {
          throw new AppError('Stock quantity cannot be negative', 400);
        }

        const supplier = await tx.supplier.findUnique({
          where: { id: supplierId },
        });

        if (!supplier) {
          throw new AppError(`Supplier with id ${supplierId} not found`, 404);
        }

        const updated = await tx.stock.updateMany({
          where: {
            productId,
            supplierId,
          },
          data: {
            quantity: {
              increment: quantity,
            }
          },
        });

        if (updated.count === 0) {
            // if stock does not exist, create it
            const newStock = await tx.stock.create({
                data: {
                    productId,
                    supplierId,
                    quantity,
                },
            });
            results.push(newStock);
        } else {
            results.push(updated);
        }
      }
      return results;
    });

    res.status(200).json({
      status: 'success',
      data: {
        stocks: updatedStocks,
      },
    });
  } catch (error) {
    next(error);
  }
};