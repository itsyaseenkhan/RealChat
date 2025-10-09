import jwt from "jsonwebtoken";

export const generateJWTToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,     
  sameSite: "none",  
  maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
})
  .status(statusCode)
    .json({
      success: true,
      message,
      user,
      token,
    });
};
