import { sendDirectMessageService, sendGroupMessageService, } from "../services/message.service.js";
import catchAsync from "../utils/catchAsync.js";
export const sendDirectMessage = catchAsync(async (req, res) => {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user?.id;
    const message = await sendDirectMessageService(senderId, recipientId, content, conversationId);
    res.status(201).json({ message });
});
export const sendGroupMessage = catchAsync(async (req, res) => {
    const { conversationId, content } = req.body;
    const senderId = req.user?._id;
    const conversation = req.conversation;
    const message = await sendGroupMessageService(conversationId, content, senderId, conversation);
    res.status(201).json({ message });
});
//# sourceMappingURL=message.controller.js.map