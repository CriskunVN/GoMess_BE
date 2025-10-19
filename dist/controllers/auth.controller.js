import AppError from "../utils/AppError.js";
import { LoginService, RegisterService } from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createTokens } from "../utils/createToken.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../types/typeToken.js";
// Đăng ký người dùng mới
export const Register = catchAsync(async (req, res, next) => {
    const { userName, email, password, displayName } = req.body;
    if (!userName || !email || !password) {
        return next(new AppError("Please provide all required fields", 400));
    }
    const newUser = await RegisterService(userName, email, password, displayName);
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
});
// Đăng nhập người dùng
export const Login = catchAsync(async (req, res, next) => {
    // lấy input từ body
    const { userName, password } = req.body;
    // xử lý logic đăng nhập
    const user = await LoginService(userName, password);
    if (!user) {
        return next(new AppError("Invalid username or password", 401));
    }
    // Tạo access token và refresh token
    const { accessToken, refreshToken } = createTokens(user._id);
    // lưu refresh token vào database
    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS),
    });
    // Cập nhật refresh token trong cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // chống XSS
        secure: true,
        sameSite: "strict", // Chỉ gửi cookie trong cùng một trang web
        maxAge: REFRESH_TOKEN_EXPIRES_DAYS, // 30 days
    });
    res.status(200).json({ status: "success", accessToken, data: { user } });
});
// Refresh access token
export const refreshToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return next(new AppError("Refresh token not provided", 401));
    }
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
        return next(new AppError("Refresh secret not defined", 500));
    }
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, refreshSecret);
    }
    catch (err) {
        return next(new AppError("Invalid refresh token", 401));
    }
    // kiểm tra người dùng còn tồn tại không
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError("User no longer exists", 401));
    }
    // Tạo access token mới
    const { accessToken } = createTokens(user._id);
    res.status(200).json({ status: "success", accessToken });
});
// lấy user hiện tại
export const getCurrentUser = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError("User not found", 404));
    }
    req.user.password = undefined;
    res.status(200).json({ status: "success", data: { user: req.user } });
});
//# sourceMappingURL=auth.controller.js.map