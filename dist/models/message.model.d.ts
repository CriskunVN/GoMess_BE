import mongoose from "mongoose";
import type { IMessage } from "../types/type.js";
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Message;
//# sourceMappingURL=message.model.d.ts.map