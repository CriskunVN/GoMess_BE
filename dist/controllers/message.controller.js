import { send } from "process";
import { sendDirectMessageService } from "../services/message.service.js";
import catchAsync from "../utils/catchAsync.js";
export const sendDirectMessage = catchAsync(async (req, res) => {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    const message = await sendDirectMessageService(senderId, recipientId, content, conversationId);
    res.status(201).json({ message });
});
export const sendGroupMessage = catchAsync(async (req, res) => { });
//# sourceMappingURL=message.controller.js.map