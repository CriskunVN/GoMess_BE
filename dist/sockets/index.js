import { Server } from "socket.io";
import http from "http";
import express from "express";
import app from "../app.js";
import { socketAuthMiddleware } from "../middlewares/socket.middleware.js";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});
io.use(socketAuthMiddleware);
io.on("connection", async (socket) => {
    const user = socket.data.user;
    console.log(`${user.displayName} online với socket : ${socket.id}`);
    // Correct built-in event name is 'disconnect'
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id} | reason: ${reason}`);
    });
});
export { io, app, server };
//# sourceMappingURL=index.js.map