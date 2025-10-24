import "dotenv/config"; // Load environment variables BEFORE other imports
import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import AppError from "./utils/AppError.js";
import { connectDB } from "./libs/db.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
