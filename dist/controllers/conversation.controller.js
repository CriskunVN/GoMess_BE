import catchAsync from "../utils/catchAsync.js";
import { createConversationService } from "../services/conversation.service.js";
export const createConversation = catchAsync(async (req, res) => {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;
    const conversation = await createConversationService(userId, name, type, memberIds);
    res
        .status(201)
        .json({ message: "Tạo cuộc trò chuyện thành công", conversation });
});
export const getConversations = catchAsync(async (req, res) => { });
export const getMessages = catchAsync(async (req, res) => { });
//# sourceMappingURL=conversation.controller.js.map