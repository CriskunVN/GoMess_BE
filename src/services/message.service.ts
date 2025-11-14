import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import type { IConversation, IMessage } from "../types/type.js";
import { updateConversationAfterCreateMessage } from "../utils/message/messageHelper.js";

// service gửi tin nhắn trực tiếp
export const sendDirectMessageService = async (
  senderId: string,
  recipientId: string,
  content: string,
  conversationId?: string
) => {
  let conversation: IConversation | null = null;

  if (!content) {
    throw new Error("Nội dung tin nhắn không được để trống");
  }
  // Tìm cuộc trò chuyện hiện có giữa hai người dùng
  if (conversationId) {
    conversation =
      ((await Conversation.findById(conversationId)) as IConversation) || null;
  }
  // Nếu không tìm thấy cuộc trò chuyện, tạo cuộc trò chuyện mới
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
  // Tạo tin nhắn mới
  const message: IMessage = (await Message.create({
    conversationId: conversation._id,
    senderId,
    content,
  })) as IMessage;

  updateConversationAfterCreateMessage(conversation, message, senderId);
  await conversation.save();

  return message;
};
