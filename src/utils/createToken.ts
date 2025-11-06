import jwt from "jsonwebtoken";
import crypto from "crypto";

// Hàm tạo JWT
const createTokens = (userId: string) => {
  const accessSecret = process.env.JWT_SECRET_KEY;
  if (!accessSecret) {
    throw new Error("JWT secrets are not defined in environment variables.");
  }

  // Tạo access token
  const accessToken = jwt.sign(
    { id: userId },
    accessSecret as any,
    {
      expiresIn: "15m", // process.env.JWT_EXPIRES_IN || "1m"
    } as any
  );

  // Tạo refresh token
  const refreshToken = crypto.randomBytes(64).toString("hex");

  return { accessToken, refreshToken };
};

const createToken = (userId: string): string => {
  // Tạo access token
  return createTokens(userId).accessToken;
};

export default createToken;
export { createTokens };
