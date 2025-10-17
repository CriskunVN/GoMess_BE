import User from "../models/user.model.js";
import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";

export const RegisterService = async (
  userName: string,
  email: string,
  password: string
) => {
  // kiểm trả xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const newUser = new User({ userName, email, password });
  await newUser.save();

  return newUser;
};

export const LoginService = async (email: string, password: string) => {
  // Validate input
  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  // Tìm người dùng theo email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 400);
  }
  // ẩn password trước khi trả về
  user.password = undefined as any;
  return user;
};
