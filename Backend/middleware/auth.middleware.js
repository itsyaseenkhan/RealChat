import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { catchAsyncError } from "./catchAsyncError.middleware.js";


export const generateJWTToken = async (user, message, statusCode, res) =>
   { const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
 expiresIn: process.env.JWT_EXPIRE,
 });

 const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);

 return res.cookie("token", token, {
 maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
 httpOnly: true, // JS se access nahi ho sakta, safe
  secure: true, 
 sameSite: "none", 
})
 .json({
 success: true,
 message,
 token,
 });
};