// import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";
// import { catchAsyncError } from "./catchAsyncError.middleware.js";

// export const isAuthenticated = catchAsyncError(async (req, res, next) => {
//   const token = req.cookies.token;
//   console.log("Cookies received:", req.cookies);

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "User not Authenticated. Please Sign in!",
//     });
//   }

//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token or token expired, please sign in again",
//     });
//   }

//   const user = await User.findById(decoded.id);
//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }

//   req.user = user;
//   next();
// });
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { catchAsyncError } from "./catchAsyncError.middleware.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  try {
    const token = req.cookies?.token; // ✅ safe check
    console.log("Cookies received:", req.cookies);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please sign in!",
      });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Find user in DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please sign in again.",
    });
  }
});
