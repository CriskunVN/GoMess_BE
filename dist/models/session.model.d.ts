import mongoose from "mongoose";
import type { ISession } from "../types/type.js";
declare const Session: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, {}> & ISession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Session;
//# sourceMappingURL=session.model.d.ts.map