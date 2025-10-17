import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// type user
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

const UserSchema: Schema<IUser> = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String },
    avatarUrl: { type: String },
    onlineAt: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
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

// tạo index để tìm kiếm nhanh hơn (removed duplicate index on email, as unique: true already creates it)
UserSchema.index({ userName: 1 }); // Example: index on userName if needed

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
