import User from "../models/user.model.js";
import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";

export const RegisterService = async (
  username: string,
  email: string,
  password: string,
  displayName: string
) => {
  // kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new AppError("Email or username already in use", 400);
  }

  const newUser = new User({ username, email, password, displayName });
  await newUser.save();

  return newUser;
};

export const LoginService = async (username: string, password: string) => {
  // Validate input
  if (!username || !password) {
    throw new AppError("Username and password are required.", 400);
  }

  // Tìm người dùng theo username
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new AppError("Invalid username or password", 400);
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid username or password", 400);
  }
  // ẩn password trước khi trả về
  user.password = undefined as any;
  return user;
};
