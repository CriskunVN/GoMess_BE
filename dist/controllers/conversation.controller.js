import catchAsync from "../utils/catchAsync.js";
import { createConversationService, getConversationsService, getMesssagesService, markConversationAsReadService, } from "../services/conversation.service.js";
import Conversation from "../models/conversation.model.js";
import { getIO } from "../sockets/index.js";
export const createConversation = catchAsync(async (req, res) => {
    const { type, name, memberIds } = req.body;
    const userId = req.user?._id;
    const conversation = await createConversationService(userId, name, type, memberIds);
    res
        .status(201)
        .json({ message: "Tạo cuộc trò chuyện thành công", conversation });
});
export const getConversations = catchAsync(async (req, res) => {
    const userId = req.user?._id;
    const data = await getConversationsService(userId);
    res
        .status(200)
        .json({ message: "Lấy danh sách cuộc trò chuyện thành công", data });
});
export const getMessages = catchAsync(async (req, res) => {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;
    const { messages, nextCursor } = await getMesssagesService(conversationId, Number(limit), cursor);
    res.status(200).json({ messages, nextCursor });
});
export const getUserConversationsForSocketIO = async (userId) => {
    try {
        const conversations = await Conversation.find({ "participants.userId": userId }, {
            _id: 1,
        });
        return conversations.map((conv) => conv._id.toString());
    }
    catch (error) {
        console.error("Lỗi lấy cuộc trò chuyện cho Socket.IO:", error);
        return [];
    }
};
export const markAsRead = catchAsync(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user?._id?.toString();
    if (!conversationId || !userId) {
        res.status(400).json({
            status: "error",
            message: "Thiếu conversationId hoặc userId",
        });
        return;
    }
    // Gọi service để đánh dấu đã đọc
    const conversation = await markConversationAsReadService(conversationId, userId);
    // Emit socket event đến tất cả users trong conversation
    const io = getIO();
    io.to(conversationId).emit("message-read", {
        conversationId: conversationId,
        userId: userId,
        seenBy: conversation.seenBy,
        timestamp: new Date(),
    });
    res.status(200).json({
        status: "success",
        message: "Đánh dấu đã đọc thành công",
        data: {
            conversationId: conversation._id,
            unreadCount: conversation.unreadCounts.get(userId) || 0,
            seenBy: conversation.seenBy,
        },
    });
});
//# sourceMappingURL=conversation.controller.js.map