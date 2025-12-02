import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new AppError("Unauthorized - Token không tồn tại", 401));
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            return next(new AppError("JWT secret key is not defined.", 500));
        }
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
            console.log("Token đã giải mã:", decoded);
        }
        catch (err) {
            return next(new AppError("Token đã hết hạn , vui lòng đăng nhập lại", 401));
        }
        const currentUser = await User.findById(decoded.id).select("-hashedPassword");
        if (!currentUser) {
            return next(new AppError("Không tìm thấy user có id = decode.userId", 401));
        }
        socket.data.user = currentUser;
        next();
    }
    catch (err) {
        console.error("Lỗi khi verify JWT trong socketMiddleware", err);
        next(new AppError("Unauthorized", 401));
    }
};
//# sourceMappingURL=socket.middleware.js.map