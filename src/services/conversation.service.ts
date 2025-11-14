import Conversation from "../models/conversation.model.js";
import type { IConversation, IUser } from "../types/type.js";

export const createConversationService = async (
  userId: IUser,
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
