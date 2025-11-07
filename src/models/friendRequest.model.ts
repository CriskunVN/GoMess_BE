import mongoose from "mongoose";
import type { IFriendRequest } from "../types/type.js";

const friendRequestSchema = new mongoose.Schema<IFriendRequest>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);
// đảm bảo một người không thể gửi nhiều lời mời kết bạn đến cùng một người
friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });
friendRequestSchema.index({ from: 1 });
friendRequestSchema.index({ to: 1 });

const FriendRequest = mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
export default FriendRequest;
