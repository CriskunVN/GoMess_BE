import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { LoginService, RegisterService } from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createTokens } from "../utils/createToken.js";
import Session from "../models/session.model.js";
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../types/typeToken.js";

// Đăng ký người dùng mới
export const Register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, displayName } = req.body;
    if (!username || !email || !password) {
      return next(new AppError("Please provide all required fields", 400));
    }

    const newUser = await RegisterService(
      username,
      email,
      password,
      displayName
    );
    if (!newUser) {
      res
        .status(400)
        .json({ status: "fail", message: "User registration failed" });
      return;
    }
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  }
);

// Đăng nhập người dùng
export const Login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // lấy input từ body
    const { username, password } = req.body;

    // xử lý logic đăng nhập
    const user = await LoginService(username, password);
    if (!user) {
      return next(new AppError("Invalid username or password", 400));
    }

    // Tạo access token và refresh token
    const { accessToken, refreshToken } = createTokens(user._id as string);

    // lưu refresh token vào database
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS),
    });

    // Cập nhật refresh token trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // chống XSS
      secure: process.env.NODE_ENV === "production", // chỉ true khi production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // lax cho development
      maxAge: REFRESH_TOKEN_EXPIRES_DAYS, // 30 days
    });

    res.status(200).json({ status: "success", accessToken, data: { user } });
  }
);

export const Logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token not provided", 401));
    }

    // Xoá refresh token khỏi database
    await Session.findOneAndDelete({ refreshToken });

    // Xoá cookie trên trình duyệt
    res.clearCookie("refreshToken");

    res
      .status(204)
      .json({ status: "success", message: "Logged out successfully" });
  }
);

// Refresh access token
export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token not provided", 403));
    }

    // Kiểm tra refresh token trong database
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return next(new AppError("Invalid refresh token or expired", 403));
    }

    // kiểm tra hết hạn chưa
    const expiresAt = (session as any).expiresAt as Date | undefined;
    if (!expiresAt || expiresAt < new Date()) {
      return next(new AppError("Refresh token expired", 403));
    }

    // Tạo access token mới - lấy userId từ session
    const userId = (session as any).userId;
    if (!userId) {
      return next(new AppError("Associated user not found for session", 403));
    }

    const { accessToken } = createTokens(String(userId));
    res.status(200).json({ status: "success", accessToken });
  }
);

export const test = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .json({ status: "success", message: "Test endpoint working" });
  }
);
