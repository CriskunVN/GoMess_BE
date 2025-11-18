import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import AppError from "../utils/AppError.js";
import { updateConversationAfterCreateMessage } from "../utils/message/messageHelper.js";
// service gửi tin nhắn trực tiếp
export const sendDirectMessageService = async (senderId, recipientId, content, conversationId) => {
    let conversation = null;
    if (!content) {
        throw new Error("Nội dung tin nhắn không được để trống");
    }
    // Tìm cuộc trò chuyện hiện có giữa hai người dùng
    if (conversationId) {
        conversation =
            (await Conversation.findById(conversationId)) || null;
    }
    // Nếu không tìm thấy cuộc trò chuyện, tạo cuộc trò chuyện mới
    if (!conversation) {
        conversation =
            (await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() },
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map(),
            })) || null;
    }
    // Tạo tin nhắn mới
    const message = (await Message.create({
        conversationId: conversation._id,
        senderId,
        content,
    }));
    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    return message;
};
export const sendGroupMessageService = async (conversationId, content, senderId, conversation) => {
    if (!content) {
        throw new AppError("Nội dung tin nhắn không được để trống", 400);
    }
    // Tạo tin nhắn mới
    const message = (await Message.create({
        conversationId: conversationId,
        senderId,
        content,
    }));
    updateConversationAfterCreateMessage(conversation, message, senderId.toString());
    await conversation.save();
    return message;
};
//# sourceMappingURL=message.service.js.map