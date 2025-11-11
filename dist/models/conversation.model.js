import mongoose from "mongoose";
import { participantSchema, groupSchema, lastMessageSchema, } from "../types/type.js";
const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["direct", "group"],
        required: true,
    },
    participants: {
        type: [participantSchema],
        required: true,
    },
    group: {
        type: groupSchema,
    },
    lastMessageAt: {
        type: Date,
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lastMessage: {
        type: lastMessageSchema,
        default: null,
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {},
    },
}, {
    timestamps: true,
});
conversationSchema.index({
    "participants.userId": 1,
    lastMessageAt: -1,
});
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
//# sourceMappingURL=conversation.model.js.map