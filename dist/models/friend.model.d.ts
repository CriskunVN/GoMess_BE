import mongoose from "mongoose";
import type { IFriend } from "../types/type.js";
declare const Friend: mongoose.Model<IFriend, {}, {}, {}, mongoose.Document<unknown, {}, IFriend, {}, {}> & IFriend & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Friend;
//# sourceMappingURL=friend.model.d.ts.map