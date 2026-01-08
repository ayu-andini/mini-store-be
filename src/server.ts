// import { AppError } from "./utils/app-error";

// app.use((err: any, req: any, res: any, next: any) => {
//     if (err instanceof AppError) {
//         return res.status(err.statusCode).json({
//         success: false,
//         message: err.message,
//         });
//     }

//     // error tidak dikenal
//     console.error(err);

//     res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//     });
// });
