import { Server } from "socket.io";
import http from "http";
import express from "express";
import app from "../app.js";
import { socketAuthMiddleware } from "../middlewares/socket.middleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversation.controller.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // user: key , socket: value

io.on("connection", async (socket) => {
  const user = socket.data.user;

  console.log(`${user.displayName} online với socket : ${socket.id}`);

  onlineUsers.set(user._id, socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  const conversationIds = await getUserConversationsForSocketIO(user._id);
  conversationIds.forEach((conversationId) => {
    socket.join(conversationId);
  });

  // Socket event: User đánh dấu đã đọc tin nhắn
  socket.on("mark-as-read", async (data: { conversationId: string }) => {
    try {
      const { conversationId } = data;
      const userId = user._id.toString();

      // Import service để xử lý
      const { markConversationAsReadService } = await import(
        "../services/conversation.service.js"
      );

      // Đánh dấu đã đọc
      const conversation = await markConversationAsReadService(
        conversationId,
        userId
      );

      // Emit event đến tất cả users trong conversation
      io.to(conversationId).emit("message-read", {
        conversationId: conversationId,
        userId: userId,
        seenBy: conversation.seenBy,
        timestamp: new Date(),
      });
    } catch (error: any) {
      socket.emit("error", {
        message: error.message || "Lỗi khi đánh dấu đã đọc",
      });
    }
  });

  // Correct built-in event name is 'disconnect'
  socket.on("disconnect", (reason) => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`Socket disconnected: ${socket.id} | reason: ${reason}`);
  });
});

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo!");
  }
  return io;
};

export { io, app, server };
