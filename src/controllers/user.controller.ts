import type { Request, Response, NextFunction, Application } from "express";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import * as userService from "../services/user.service.js";

// Lấy thông tin người dùng theo ID
export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req.params.id as any);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({ status: "success", data: { user } });
  }
);

// Lấy nhiều thông tin người dùng hiện tại
export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers();

    if (!users || users.length === 0) {
      return next(new AppError("No users found", 404));
    }

    res.status(200).json({ status: "success", data: { users } });
  }
);

// Cập nhật thông tin người dùng
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not found", 404));
    }

    const userUpdated = await userService.updateUser(
      req.user._id as string,
      req.body
    );

    res.status(200).json({ status: "success", data: { user: userUpdated } });
  }
);

// Xoá người dùng
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not found", 404));
    }

    await userService.deleteUser(req.user._id as string);

    res.status(204).json({ status: "success", data: null });
  }
);

// Xóa mềm người dùng (soft delete)
export const softDeleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not found", 404));
    }

    await userService.updateUser(req.user._id as string, { isActive: false });

    res.status(204).json({ status: "success", data: null });
  }
);
