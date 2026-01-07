import express from "express";
import products from "../src/routes/products";
import orders from "../src/routes/orders";
import users from "../src/routes/users";
// import { AppError } from "./utils/app-error";
// import { NextFunction, Request, Response } from "express";

const app = express()
app.use(express.json())

app.use('/api/v1', products)
app.use('/api/v1', orders)
app.use('/api/v1', users)

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

app.listen(process.env.PORT, ()=>{
    console.log("server is running");
    
})
