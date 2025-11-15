import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import AppError from "../utils/AppError.js";
export const createConversationService = async (userId, name, type, memberIds) => {
    if (!type ||
        (type === "group" && !name) ||
        !memberIds ||
        !Array.isArray(memberIds) ||
        memberIds.length === 0) {
        throw new Error("Tên nhóm và danh sách thành viên là bắt buộc");
    }
    let conversation = null;
    // Xử lý cuộc trò chuyện trực tiếp
    if (type === "direct") {
        // lấy id người tham gia cuộc trò chuyện trực tiếp
        const participantId = memberIds[0];
        // Tìm cuộc trò chuyện trực tiếp hiện có giữa hai người dùng
        conversation = (await Conversation.findOne({
            type: "direct",
            "participants.userId": { $all: [userId, participantId] },
        }));
        // Nếu không tìm thấy cuộc trò chuyện, tạo cuộc trò chuyện mới
        if (!conversation) {
            conversation = new Conversation({
                type: "direct",
                participants: [{ userId }, { userId: participantId }],
                lastMessageAt: new Date(),
            });
        }
        await conversation.save();
    }
    // Xử lý trò chuyện nhóm
    if (type === "group") {
        conversation = new Conversation({
            type: "group",
            participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
            group: {
                name,
                createdBy: userId,
            },
            lastMessageAt: new Date(),
        });
        await conversation.save();
    }
    if (!conversation) {
        throw new Error("Conversation type không hợp lệ");
    }
    await conversation.populate([
        {
            path: "participants.userId",
            select: "displayName avatarUrl",
        },
        {
            path: "seenBy",
            select: "displayName avatarUrl",
        },
        {
            path: "lastMessage.senderId",
            select: "displayName avatarUrl",
        },
    ]);
    return conversation;
};
export const getConversationsService = async (userId) => {
    const conversations = await Conversation.find({
        "participants.userId": userId,
    })
        .sort({ lastMessageAt: -1, updateAt: -1 })
        .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
    })
        .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
    })
        .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
    });
    const dataFormatted = conversations.map((convo) => {
        const participants = (convo.participants || []).map((p) => ({
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinedAt: p.joinedAt,
        }));
        return {
            ...convo.toObject(),
            unreadCounts: convo.unreadCounts || {},
            participants,
        };
    });
    return dataFormatted;
};
export const getMesssagesService = async (conversationId, limit, cursor) => {
    const query = { conversationId };
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }
    let messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) + 1);
    let nextCursor = null;
    if (messages.length > Number(limit)) {
        const nextMessage = messages[messages.length - 1];
        nextCursor = nextMessage.createdAt.toISOString();
        messages.pop();
    }
    messages = messages.reverse();
    return { messages, nextCursor };
};
//# sourceMappingURL=conversation.service.js.map