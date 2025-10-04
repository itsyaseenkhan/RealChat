import jwt from "jsonwebtoken";

export const generateJWTToken = async (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);

  return res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // cookie ka expiry
      httpOnly: true, // JS se access na ho
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookie issue fix
      secure: process.env.NODE_ENV === "production", // HTTPS required in production
    })
    .json({
      success: true,
      message,
      token,
    });
};
