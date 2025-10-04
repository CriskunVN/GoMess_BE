import jwt from "jsonwebtoken";
// Hàm tạo JWT
const createToken = (userId) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
    }
    return jwt.sign({ id: userId }, secretKey, {
        expiresIn: "1h",
    });
};
export default createToken;
//# sourceMappingURL=createToken.js.map