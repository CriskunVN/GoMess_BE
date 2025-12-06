import type { Socket } from "socket.io";
import type { IConversation, IMessage } from "../../types/type.js";
import { io } from "../../sockets/index.js";

export const updateConversationAfterCreateMessage = (
  conversation: any,
  message: any,
  senderId: String
) => {
  conversation.set({
    seenBy: [senderId], // Người gửi tự động "đã xem"
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.participants.forEach((p: any) => {
    const memberId = p.userId.toString();
    const isSender = memberId === senderId.toString();
    const preCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : preCount + 1);
  });
};

export const emitNewMessage = (
  io: any,
  conversation: any,
  message: IMessage
) => {
  io.to(conversation._id.toString()).emit("new-message", {
    message,
    conversation: {
      _id: conversation._id.toString(),
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    unreadCounts: conversation.unreadCounts,
  });
};
