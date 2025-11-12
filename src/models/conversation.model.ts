import mongoose, { Types } from "mongoose";
import type { IConversation } from "../types/type.js";

export const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

export const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Ảnh đại diện nhóm
    avatarUrl: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

export const lastMessageSchema = new mongoose.Schema(
  {
    _id: { type: String },
    content: { type: String, default: null },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
      createdAt: {
        type: Date,
        default: null,
      },
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema<IConversation>(
  {
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
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({
  "participants.userId": 1,
  lastMessageAt: -1,
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
export default Conversation;
