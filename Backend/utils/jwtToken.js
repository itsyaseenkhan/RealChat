// import jwt from "jsonwebtoken";

// export const generateJWTToken = async(user,message, statusCode, res) =>{
//     const token = jwt.sign({id: user._id} , process.env.JWT_SECRET_KEY,{
//         expiresIn: process.env.JWT_EXPIRE,
//     })
//      const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);
     
//     return res.status(statusCode).cookie("token", token, {
//         maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//        sameSite: "none",
//        secure: process.env.NODE_ENV === "production",

//     })
//     .json({
//         success: true,
//         message,
//         token,
//     });

// }   
import jwt from "jsonwebtoken";

export const generateJWTToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE, // e.g. "7d"
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

  return res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // in ms
      httpOnly: true,       // can't access via JS
      sameSite: "none",     // required for cross-site
      secure: true,         // always true in production (Render + Netlify = HTTPS)
    })
    .json({
      success: true,
      message,
      user,   // 👈 send user details
      // token, // optional, remove if you rely only on cookie
    });
};

