import jwt from "jsonwebtoken";

export const generateJWTToken = async (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);

return res
  .cookie("token", token, {
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, 
    httpOnly: true, // safe cookie
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  })
  .status(statusCode) // ← status code add کریں
  .json({
    success: true,
    message,
    token,
  });
}