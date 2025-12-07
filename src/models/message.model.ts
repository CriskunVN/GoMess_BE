import mongoose, { Document } from "mongoose";
import type { IMessage } from "../types/type.js";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    // Loại tin nhắn: text, image, video, file
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    // URL của file (image/video/file)
    fileUrl: {
      type: String,
    },
    // Thumbnail URL cho images (tối ưu cho preview)
    thumbnailUrl: {
      type: String,
    },
    // Optimized URL cho hiển thị (tối ưu quality + size)
    optimizedUrl: {
      type: String,
    },
    // Thông tin file
    fileInfo: {
      fileName: String,
      fileSize: Number, // bytes
      mimeType: String,
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index để tối ưu truy vấn theo conversationId và sắp xếp theo createdAt
// Tin nhắn mới nhất sẽ ở trên cùng khi truy vấn theo conversationId
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
