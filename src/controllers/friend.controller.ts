import catchAsync from "../utils/catchAsync.js";
import type { Request, Response } from "express";

// Lấy danh sách bạn bè
export const getAllFriends = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Lấy danh sách bạn bè" });
});

// Gửi lời mời kết bạn
export const sendFriendRequest = catchAsync(
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Gửi lời mời kết bạn" });
  }
);

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = catchAsync(
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Chấp nhận lời mời kết bạn" });
  }
);

// Từ chối lời mời kết bạn
export const declineFriendRequest = catchAsync(
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Từ chối lời mời kết bạn" });
  }
);

// Lấy danh sách lời mời kết bạn
export const getFriendRequest = catchAsync(
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Lấy danh sách lời mời kết bạn" });
  }
);

// Xóa bạn bè
export const removeFriend = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Xóa bạn bè" });
});
