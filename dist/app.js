import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { protect } from "./middlewares/protectAuth.middleware.js";
const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
//1. Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true })); // CORS cho phép truy cập từ client
app.use(morgan("dev")); // Ghi log các request
app.use(cookieParser());
app.use(express.json());
//2. Routes
const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.use(`${apiPrefix}/auth`, AuthRoute);
app.use(protect);
app.use(`${apiPrefix}/users`, UserRoute);
// Error handling
// 404 xử lý các route không tồn tại
app.use((req, _res, next) => {
    next(new AppError(`Không tìm thấy đường dẫn ${req.originalUrl}`, 404));
});
// Middleware xử lý lỗi toàn cục
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map