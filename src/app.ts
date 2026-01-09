import express from "express";
import products from "./routes/products";
import orders from "./routes/orders";
import users from "./routes/users";
import suppliers from "./routes/suppliers";
import auth from "./routes/auth";

import { errorHandler } from "./middleware/error-handler";
import AppError from "./utils/app-error";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1', 
    products, orders, users, suppliers, auth);

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(errorHandler);

app.listen(process.env.PORT, ()=>{
    console.log("server is running");

    if (!process.env.JWT_SECRET) { throw new Error('JWT_SECRET is not defined'); }   
})