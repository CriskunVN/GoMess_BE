import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
export const RegisterService = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already in use", 400);
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    return newUser;
};
export const LoginService = async (email, password) => {
    // Validate input
    if (!email || !password) {
        throw new AppError("Email and password are required.", 400);
    }
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid email or password", 400);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 400);
    }
    return user;
};
//# sourceMappingURL=auth.service.js.map