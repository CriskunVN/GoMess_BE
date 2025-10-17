import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { LoginService, RegisterService } from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createTokens } from "../utils/createToken.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Đăng ký người dùng mới
export const Register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return next(new AppError("Please provide all required fields", 400));
    }

    try {
      const newUser = await RegisterService(userName, email, password);
      if (!newUser) {
        res
          .status(400)
          .json({ status: "fail", message: "User registration failed" });
        return;
      }
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: { user: newUser },
      });
    } catch (error) {
      next(new AppError("Failed to register user", 500));
    }
  }
);

// Đăng nhập người dùng
export const Login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await LoginService(email, password);
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const { accessToken, refreshToken } = createTokens(user._id as string);

    // Cập nhật refresh token trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ status: "success", accessToken, data: { user } });
  }
);

// Refresh access token
export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token not provided", 401));
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      return next(new AppError("Refresh secret not defined", 500));
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return next(new AppError("Invalid refresh token", 401));
    }

    // kiểm tra người dùng còn tồn tại không
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // Tạo access token mới
    const { accessToken } = createTokens(user._id as string);
    res.status(200).json({ status: "success", accessToken });
  }
);

// lấy user hiện tại
export const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not found", 404));
    }
    req.user.password = undefined as any;
    res.status(200).json({ status: "success", data: { user: req.user } });
  }
);
