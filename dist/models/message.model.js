import mongoose, { Document } from "mongoose";
const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
    },
}, {
    timestamps: true,
});
// Tạo index để tối ưu truy vấn theo conversationId và sắp xếp theo createdAt
// Tin nhắn mới nhất sẽ ở trên cùng khi truy vấn theo conversationId
messageSchema.index({ conversationId: 1, createdAt: -1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;
//# sourceMappingURL=message.model.js.map