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
//# sourceMappingURL=index.js.map