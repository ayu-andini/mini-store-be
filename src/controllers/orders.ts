import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";

// Custom Error Classes for more specific error handling
class UserNotFoundError extends Error {
    constructor(message = "User not found") {
        super(message);
        this.name = "UserNotFoundError";
    }
}

class ProductNotFoundError extends Error {
    constructor(message = "Product not found") {
        super(message);
        this.name = "ProductNotFoundError";
    }
}

class InsufficientStockError extends Error {
    constructor(message = "Not enough stock") {
        super(message);
        this.name = "InsufficientStockError";
    }
}

class OrderNotFoundError extends Error {
    constructor(message = "Order not found") {
        super(message);
        this.name = "OrderNotFoundError";
    }
}


export const getAllOrders = async (req: Request, res:Response)=>{
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                product: true
            }
        })
        res.json({message:"Showed All Data Orders", data: orders})
    } catch (error) {
        res.status(500).json({error: "failed to fetch orders"})
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                user: true,
                product: true
            }
        });

        if (!order) {
            throw new OrderNotFoundError();
        }

        res.json({ message: "Showed Order Data by ID", data: order });
    } catch (error) {
        if (error instanceof OrderNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: "failed to fetch order" });
    }
}

export const createOrder = async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: "userId, productId, and quantity are required" });
    }

    try {
        const result = await prisma.$transaction(
            async (prisma: Prisma.TransactionClient) => {

        // const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new UserNotFoundError();
            }

            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new ProductNotFoundError();
            }

            // if (product.stock < quantity) {
            //     throw new InsufficientStockError(`Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`);
            // }

            // const updatedProduct = await prisma.product.update({
            //     where: { id: productId },
            //     data: { stock: product.stock - quantity },
            // });

            const order = await prisma.order.create({
                data: {
                    userId,
                    productId,
                    quantity,
                },
                include: {
                    user: true,
                    product: true
                }
            });

            return { order };
        });

        res.status(201).json({ message: "Order created successfully", data: result.order });
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof InsufficientStockError) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ error: "Failed to create order" });
    }
};

// export const updateOrder = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { quantity } = req.body;

//     if (quantity === undefined) {
//         return res.status(400).json({ error: "Quantity is required" });
//     }
//     const newQuantity = Number(quantity);
//     if (isNaN(newQuantity) || newQuantity <= 0) {
//         return res.status(400).json({ error: "Quantity must be a positive number" });
//     }

//     try {
//         const updatedOrder = await prisma.$transaction(async (prisma) => {
//             const order = await prisma.order.findUnique({
//                 where: { id: Number(id) },
//             });

//             if (!order) {
//                 throw new OrderNotFoundError();
//             }

//             const product = await prisma.product.findUnique({
//                 where: { id: order.productId },
//             });

//             if (!product) {
//                 // This should ideally not happen if database is consistent
//                 throw new ProductNotFoundError();
//             }

//             const quantityDiff = newQuantity - order.quantity;

//             if (quantityDiff > 0 && product.stock < quantityDiff) {
//                 throw new InsufficientStockError(`Not enough stock. Available: ${product.stock}, Requested additional: ${quantityDiff}`);
//             }

//             // Update product stock
//             await prisma.product.update({
//                 where: { id: order.productId },
//                 data: { stock: product.stock - quantityDiff },
//             });

//             // Update order
//             const updatedOrder = await prisma.order.update({
//                 where: { id: Number(id) },
//                 data: { quantity: newQuantity },
//                 include: {
//                     // user: true,
//                     product: true
//                 }
//             });

//             return updatedOrder;
//         });

//         res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
//     } catch (error) {
//         if (error instanceof OrderNotFoundError) {
//             return res.status(404).json({ message: error.message });
//         }
//         if (error instanceof ProductNotFoundError) {
//             return res.status(404).json({ message: error.message });
//         }
//         if (error instanceof InsufficientStockError) {
//             return res.status(400).json({ message: error.message });
//         }
//         res.status(500).json({ error: "Failed to update order" });
//     }
// };

// export const deleteOrder = async (req: Request, res: Response) => {
//     const { id } = req.params;

//     try {
//         const deletedOrder = await prisma.$transaction(async (prisma) => {
//             const order = await prisma.order.findUnique({
//                 where: { id: Number(id) },
//             });

//             if (!order) {
//                 throw new OrderNotFoundError();
//             }

//             // Increase product stock
//             await prisma.product.update({
//                 where: { id: order.productId },
//                 data: { stock: { increment: order.quantity } },
//             });

//             // Delete order
//             const deletedOrder = await prisma.order.delete({
//                 where: { id: Number(id) },
//             });

//             return deletedOrder;
//         });

//         res.status(200).json({ message: "Order deleted successfully", data: deletedOrder });
//     } catch (error) {
//         if (error instanceof OrderNotFoundError) {
//             return res.status(404).json({ message: error.message });
//         }
//         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
//              return res.status(409).json({ message: "Cannot delete order due to existing references."});
//         }
//         res.status(500).json({ error: "Failed to delete order" });
//     }
// };

export const getOrdersSummary = async (req: Request, res: Response) => {
  try {
    const orderSummary = await prisma.order.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      orderBy: {
        userId: "asc",
      },
    });

    // ✅ tipe hasil groupBy
    type OrderSummary = {
      userId: number;
      _count: {
        id: number;
      };
    };

    const userIds = orderSummary.map(
      (summary: OrderSummary) => summary.userId
    );

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // ✅ tipe user
    type UserSummary = {
      id: number;
      name: string;
      email: string;
    };

    // ✅ Map dengan generic
    const userMap = new Map<number, UserSummary>(
      users.map((user: UserSummary) => [user.id, user])
    );

    const summaryWithUserDetails = orderSummary.map(
      (summary: OrderSummary) => {
        const user = userMap.get(summary.userId);

        return {
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null,
          orderCount: summary._count.id,
        };
      }
    );

    res.json({
      message: "Orders summary by user",
      data: summaryWithUserDetails,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get orders summary" });
  }
};


// export const getOrdersSummaryDetail = async (req: Request, res: Response) => {
//   const { id: userId } = req.params;

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//     });

//     if (!user) {
//       throw new UserNotFoundError();
//     }

//     const orders: OrderWithProduct[] = await prisma.order.findMany({
//       where: {
//         userId: Number(userId),
//       },
//       include: {
//         product: true,
//       },
//       orderBy: {
//         id: "asc",
//       },
//     });

//     if (orders.length === 0) {
//       return res.status(200).json({
//         message: `No orders found for user ${user.name}`,
//         data: {
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//           },
//           orders: [],
//         },
//       });
//     }

//     const totalAmount = orders.reduce(
//       (acc, order) => acc + order.product.price * order.quantity,
//       0
//     );

//     res.json({
//       message: `Order summary for user ${user.name}`,
//       data: {
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//         },
//         orders,
//         summary: {
//           totalOrders: orders.length,
//           totalAmount,
//         },
//       },
//     });
//   } catch (error) {
//     if (error instanceof UserNotFoundError) {
//       return res.status(404).json({ message: error.message });
//     }
//     res.status(500).json({ error: "Failed to get order summary detail" });
//   }
// };
