import { sendDirectMessageService, sendGroupMessageService, } from "../services/message.service.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
export const sendDirectMessage = catchAsync(async (req, res) => {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user?.id;
    const file = req.file; // Lấy file từ multer (nếu có)
    const message = await sendDirectMessageService(senderId, recipientId, content, conversationId, file // Truyền file vào service
    );
    res.status(201).json({
        status: "success",
        message: file
            ? "Gửi tin nhắn có file thành công"
            : "Gửi tin nhắn thành công",
        data: { message },
    });
});
export const sendGroupMessage = catchAsync(async (req, res) => {
    const { conversationId, content } = req.body;
    const senderId = req.user?._id;
    const file = req.file; // Lấy file từ multer (nếu có)
    const conversation = req.conversation;
    const message = await sendGroupMessageService(conversationId, content, senderId, conversation, file // Truyền file vào service
    );
    res.status(201).json({
        status: "success",
        message: file
            ? "Gửi tin nhắn có file thành công"
            : "Gửi tin nhắn thành công",
        data: { message },
    });
});
//# sourceMappingURL=message.controller.js.map