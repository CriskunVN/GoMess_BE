import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { LoginService, RegisterService } from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import createToken from "../utils/createToken.js";

// Đăng ký người dùng mới
export const Register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
      const newUser = await RegisterService(name, email, password);
      if (!newUser) {
        res
          .status(400)
          .json({ status: "fail", message: "User registration failed" });
        return;
      }
      res
        .status(201)
        .json({ status: "success", message: "User registered successfully" });
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

    const token = createToken(user._id as string);
    res.status(200).json({ status: "success", token });
  }
);
