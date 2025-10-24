import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: { type: String, required: true, select: false },
    phoneNumber: {
        type: String,
        sparse: true, // cho phép null nhưng không được trùng lặp nếu có giá trị
    },
    onlineAt: { type: Date },
    bio: { type: String, maxlength: 500 },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String }, // lưu đường dẫn ảnh
    avatarID: { type: String }, // lưu ID ảnh trên dịch vụ lưu trữ (xóa , cập nhật dễ dàng)
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true, // tự động thêm createdAt và updatedAt
});
// Hash mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// so sánh mật khẩu
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", UserSchema);
export default User;
//# sourceMappingURL=user.model.js.map