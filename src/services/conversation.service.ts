import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getIO } from "../sockets/index.js";
import type { IConversation, IUser } from "../types/type.js";
import AppError from "../utils/AppError.js";
import { io } from "../sockets/index.js";

export const createConversationService = async (
  userId: String,
  name: string,
  type: "direct" | "group",
  memberIds: string[]
) => {
  if (
    !type ||
    (type === "group" && !name) ||
    !memberIds ||
    !Array.isArray(memberIds) ||
    memberIds.length === 0
  ) {
    throw new Error("Tên nhóm và danh sách thành viên là bắt buộc");
  }
  let conversation: IConversation | null = null;

  // Xử lý cuộc trò chuyện trực tiếp
  if (type === "direct") {
    // lấy id người tham gia cuộc trò chuyện trực tiếp
    const participantId = memberIds[0];

    // Tìm cuộc trò chuyện trực tiếp hiện có giữa hai người dùng
    conversation = (await Conversation.findOne({
      type: "direct",
      "participants.userId": { $all: [userId, participantId] },
    })) as IConversation | null;

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

    // Emit tới người tạo group
    console.log(`[DEBUG] Creator room: "${userId.toString()}"`);
    io.to(userId.toString()).emit("new-group", conversation);
    // Emit tới tất cả thành viên được thêm vào
    memberIds.forEach((memberId) => {
      console.log(
        `[DEBUG] Member room: "${memberId.toString()}" | type: ${typeof memberId}`
      );
      io.to(memberId.toString()).emit("new-group", conversation);
    });
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

export const getConversationsService = async (userId: String) => {
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
    const participants = (convo.participants || []).map((p: any) => ({
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

export const getMesssagesService = async (
  conversationId: any,
  limit: number,
  cursor: any
) => {
  const query: any = { conversationId };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor as string) };
  }
  let messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) + 1);

  let nextCursor: string | null = null;

  if (messages.length > Number(limit)) {
    const nextMessage: any = messages[messages.length - 1];
    nextCursor = nextMessage.createdAt.toISOString();
    messages.pop();
  }

  messages = messages.reverse();

  return { messages, nextCursor };
};

export const markConversationAsReadService = async (
  conversationId: string,
  userId: string
) => {
  // Tìm conversation
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError("Không tìm thấy cuộc trò chuyện", 404);
  }

  // Kiểm tra user có phải là thành viên của conversation không
  const isParticipant = conversation.participants.some(
    (p: any) => p.userId.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new AppError(
      "Bạn không phải là thành viên của cuộc trò chuyện này",
      403
    );
  }

  // Reset unreadCount của user về 0
  if (conversation.unreadCounts.get(userId.toString()) !== 0) {
    conversation.unreadCounts.set(userId.toString(), 0);
  }

  // Lấy senderId của tin nhắn cuối cùng
  const lastMessage: any = conversation.lastMessage;
  const lastMessageSenderId = lastMessage?.senderId?.toString();

  // Chỉ thêm vào seenBy nếu:
  // 1. User chưa có trong seenBy
  // 2. User KHÔNG phải là người gửi tin nhắn cuối cùng
  const isAlreadySeen = conversation.seenBy.some(
    (id: any) => id.toString() === userId.toString()
  );
  const isLastSender = lastMessageSenderId === userId.toString();

  if (!isAlreadySeen && !isLastSender) {
    conversation.seenBy.push(userId as any);
  }

  await conversation.save();

  return conversation;
};
