import jwt from "jsonwebtoken";

export const generateJWTToken = async (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);

return res.cookie("token", token, {
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
    httpOnly: true,         // JS se access nahi ho sakta, safe
    secure: process.env.NODE_ENV === "production", // HTTPS ke liye true
    sameSite: "none",       // cross-site request ke liye must
})
.json({
    success: true,
    message,
    token,
});
};