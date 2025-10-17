import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    userName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    avatarUrl?: string;
    onlineAt?: Date;
    isActive: boolean;
    role: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=user.model.d.ts.map