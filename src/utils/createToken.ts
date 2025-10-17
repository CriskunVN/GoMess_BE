import jwt from "jsonwebtoken";

// Hàm tạo JWT
const createTokens = (userId: string) => {
  const accessSecret = process.env.JWT_SECRET_KEY;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT secrets are not defined in environment variables.");
  }

  // Tạo access token
  const accessToken = jwt.sign(
    { id: userId },
    accessSecret as any,
    {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    } as any
  );

  // Tạo refresh token
  const refreshToken = jwt.sign(
    { id: userId },
    refreshSecret as any,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
    } as any
  );

  return { accessToken, refreshToken };
};

const createToken = (userId: string): string => {
  // Tạo access token
  return createTokens(userId).accessToken;
};

export default createToken;
export { createTokens };
