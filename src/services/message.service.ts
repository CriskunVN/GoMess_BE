import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import type { IConversation, IMessage, IUser } from "../types/type.js";
import { io } from "../sockets/index.js";
import AppError from "../utils/AppError.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/message/messageHelper.js";
import {
  uploadFileToCloudinary,
  getMessageTypeFromMimeType,
} from "./upload.service.js";

// =======================================
// service gửi tin nhắn trực tiếp
// =======================================
export const sendDirectMessageService = async (
  senderId: String,
  recipientId: String,
  content: string,
  conversationId?: String,
  file?: Express.Multer.File // Thêm tham số file (optional)
) => {
  let conversation: IConversation | null = null;

  // Validate: phải có content HOẶC file
  if (!content && !file) {
    throw new AppError("Tin nhắn phải có nội dung hoặc file", 400);
  }

  // Tìm cuộc trò chuyện hiện có giữa hai người dùng
  if (conversationId) {
    conversation =
      ((await Conversation.findById(conversationId)) as IConversation) || null;
  }

  // Nếu không tìm thấy cuộc trò chuyện, tạo cuộc trò chuyện mới
  if (!conversation) {
    conversation = (await Conversation.findOne({
      type: "direct",
      "participants.userId": { $all: [senderId, recipientId] },
    })) as IConversation | null;

    if (!conversation) {
      conversation =
        ((await Conversation.create({
          type: "direct",
          participants: [
            { userId: senderId, joinedAt: new Date() },
            { userId: recipientId, joinedAt: new Date() },
          ],
          lastMessageAt: new Date(),
          unreadCounts: new Map(),
        })) as IConversation) || null;
    }
  }
  const messageData = await messageDataToUpload(
    file,
    String(conversation!._id),
    senderId,
    content
  );

  // Tạo tin nhắn mới
  const message: IMessage = (await Message.create(messageData)) as IMessage;

  updateConversationAfterCreateMessage(conversation, message, senderId);
  await conversation.save();

  emitNewMessage(io, conversation, message);

  return message;
};

// =======================================
// service gửi tin nhắn nhóm
// =======================================
export const sendGroupMessageService = async (
  conversationId: String,
  content: String,
  senderId: String,
  conversation: IConversation,
  file?: Express.Multer.File // Thêm tham số file (optional)
) => {
  // Validate: phải có content HOẶC file
  if (!content && !file) {
    throw new AppError("Tin nhắn phải có nội dung hoặc file", 400);
  }

  const messageData = await messageDataToUpload(
    file,
    conversationId,
    senderId,
    content
  );

  // Tạo tin nhắn mới
  const message: IMessage = (await Message.create(messageData)) as IMessage;

  updateConversationAfterCreateMessage(
    conversation,
    message,
    senderId.toString()
  );
  await conversation.save();
  emitNewMessage(io, conversation, message);

  return message;
};

const messageDataToUpload = async (
  file: any,
  conversationId: String,
  senderId: String,
  content?: String
) => {
  let messageData: any = {
    conversationId: conversationId,
    senderId,
    content: content || "",
    messageType: "text",
  };

  // Nếu có file, upload lên Cloudinary
  if (file) {
    const uploadResult = await uploadFileToCloudinary(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    messageData.messageType = getMessageTypeFromMimeType(file.mimetype);
    messageData.content = content || getMessageTypeFromMimeType(file.mimetype);
    messageData.fileUrl = uploadResult.fileUrl;
    messageData.thumbnailUrl = uploadResult.thumbnailUrl; // Thumbnail cho preview
    messageData.optimizedUrl = uploadResult.optimizedUrl; // URL tối ưu
    messageData.fileInfo = {
      fileName: uploadResult.fileName,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      width: uploadResult.width,
      height: uploadResult.height,
    };
  }
  return messageData;
};
