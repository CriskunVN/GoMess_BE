import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// type user
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  onlineAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    onlineAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash mật khẩu trước khi lưu
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// so sánh mật khẩu
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// tạo index để tìm kiếm nhanh hơn
UserSchema.index({ email: 1 });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
