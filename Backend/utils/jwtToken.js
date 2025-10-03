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
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);

  return res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // convert days → ms
      httpOnly: true, // JS se access nahi ho sakti
      sameSite: "none", // cross-site allow
      secure: process.env.NODE_ENV === "production", // prod me only HTTPS
    })
    .json({
      success: true,
      message,
      token,
    });
};
