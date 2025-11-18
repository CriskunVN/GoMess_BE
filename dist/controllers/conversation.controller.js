import catchAsync from "../utils/catchAsync.js";
import { createConversationService, getConversationsService, getMesssagesService, } from "../services/conversation.service.js";
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
//# sourceMappingURL=conversation.controller.js.map