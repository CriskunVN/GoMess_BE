import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Middle để bảo vệ các route yêu cầu xác thực (authentication)
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) get token từ header hoặc cookie
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to get access.", 401)
      );
    }

    // 2) Verify token
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return next(new AppError("JWT secret key is not defined.", 500));
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }

    // 3) kiểm tra người dùng còn tồn tại không
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) gán người dùng vào req.user để sử dụng trong các route tiếp theo
    req.user = currentUser;
    next();
  }
);

// Middle để giới hạn quyền truy cập dựa trên vai trò (role) (Authorization)
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
