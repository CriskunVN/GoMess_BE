import catchAsync from "../utils/catchAsync.js";
import { createConversationService, getConversationsService, getMesssagesService, } from "../services/conversation.service.js";
import Conversation from "../models/conversation.model.js";
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
//# sourceMappingURL=conversation.controller.js.map