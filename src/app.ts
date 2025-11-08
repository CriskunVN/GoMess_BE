import express from "express";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();
import type { Request, Response, NextFunction, Application } from "express";
const app: Application = express();

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { protect } from "./middlewares/protectAuth.middleware.js";

// import routes
import AuthRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
import FriendRoute from "./routes/friend.route.js";

const CLIENT_URL: string = process.env.CLIENT_URL as string;
//1. Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true })); // CORS cho phép truy cập từ client
app.use(morgan("dev")); // Ghi log các request
app.use(cookieParser());
app.use(express.json());

//2. Routes

app.use(`${process.env.API_PREFIX}/auth`, AuthRoute);
app.use(protect);
app.use(`${process.env.API_PREFIX}/users`, UserRoute);
app.use(`${process.env.API_PREFIX}/friends`, FriendRoute);

// Error handling
// 404 xử lý các route không tồn tại
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Không tìm thấy đường dẫn ${req.originalUrl}`, 404));
});

// Middleware xử lý lỗi toàn cục
app.use(globalErrorHandler);

export default app;
