import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
const app = express();
//1. Middleware
app.use(cors());
app.use(morgan("dev")); // Ghi log các request
app.use(cookieParser());
app.use(express.json());
//2. Routes
const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.use(`${apiPrefix}/auth`, AuthRoute);
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