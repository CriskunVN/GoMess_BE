import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

// Lấy thông tin người dùng theo ID
export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

// Lấy nhiều thông tin người dùng
export const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

// Cập nhật thông tin người dùng
export const updateUser = async (id: string, updateData: any) => {
  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  }).select("-password");
  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
};

// Xoá người dùng
export const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new AppError("User not found", 404);
  }
};
