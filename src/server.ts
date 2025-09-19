import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import AppError from "./utils/AppError.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.handshake.query.userId);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.handshake.query.userId);
  });
});

// Connect to MongoDB
if (!process.env.DATABASE) {
  console.log(process.env.DATABASE);
  throw new AppError("DATABASE environment variable is not defined", 500);
}

// Replace <PASSWORD> with your actual database password
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

// Connect to the database using mongoose
mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
