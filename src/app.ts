import express from "express";
import products from "./routes/products";
import orders from "./routes/orders";
import users from "./routes/users";
import suppliers from "./routes/suppliers";
import { errorHandler } from "./middleware/error-handler";
import AppError from "./utils/app-error";

const app = express();
app.use(express.json());

// import { NextFunction, Request, Response } from "express";

// Global error handling middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err); // Log the error for debugging

//     if (err instanceof AppError) {
//         return res.status(err.statusCode).json({
//             status: "error",
//             message: err.message,
//         });
//     }
//     return res.status(500).json({
//         status: "error",
//         message: "Internal Server Error",
//     });
// });

app.use('/api/v1', products)
app.use('/api/v1', orders)
app.use('/api/v1', users)
app.use('/api/v1', suppliers);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(errorHandler);

app.listen(process.env.PORT, ()=>{
    console.log("server is running");
    
})