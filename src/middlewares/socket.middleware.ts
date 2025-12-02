import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import type { Socket } from "socket.io";
type SocketNextFunction = (err?: Error) => void;
export const socketAuthMiddleware = async (
  socket: Socket,
  next: SocketNextFunction
) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new AppError("Unauthorized - Token không tồn tại", 401));
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return next(new AppError("JWT secret key is not defined.", 500));
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return next(
        new AppError("Token đã hết hạn , vui lòng đăng nhập lại", 401)
      );
    }

    const currentUser = await User.findById(decoded.id).select(
      "-hashedPassword"
    );

    if (!currentUser) {
      return next(
        new AppError("Không tìm thấy user có id = decode.userId", 401)
      );
    }

    socket.data.user = currentUser;

    next();
  } catch (err) {
    console.error("Lỗi khi verify JWT trong socketMiddleware", err);
    next(new AppError("Unauthorized", 401));
  }
};
