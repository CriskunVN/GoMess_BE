import mongoose from "mongoose";
import type { IConversation } from "../types/type.js";
declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Conversation;
//# sourceMappingURL=conversation.model.d.ts.map