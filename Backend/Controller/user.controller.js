import {catchAsyncError} from "../middleware/catchAsyncError.middleware.js";
import User from "../models/userModel.js";
import { generateJWTToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const Signup = catchAsyncError(async(req,res,next) => {
   const { FullName, Email, password } = req.body;
  if (!FullName || !Email || !password) {
    return res.status(400).json({
        sucess : false ,
        message: "please provide All Details.",
    })
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if(!emailRegex.test(Email)){
      return res.status(400).json({
        sucess : false ,
        message: "Invalid Email Format .",
    }) 
    };

      if(password.length < 8){
      return res.status(400).json({
      sucess : false ,
      message: "Password much be atleast 8 characters long .",
      }) 
      };

      const isEmailAlreadyUsed = await User.findOne({ Email });
      if(isEmailAlreadyUsed){
          return res.status(400).json({
          success : false ,
           message: "Email Already Registered.",
      }) 
      }

      const hashedPassword = await bcrypt.hash(password,10);
      
      const user = await User.create({
        FullName,
        Email,
        password: hashedPassword,
        Avatar:{
            public_id:"",
            url: "",
        }
      })
      generateJWTToken(user, "User Registered Sucessfully", 201 , res )

}); 


export const Signin = catchAsyncError(async(req,res,next) => {
  const { Email, password } = req.body;
  console.log(Email,password);

   if (!Email || !password) {
    return res.status(400).json({
        success : false ,
        message: "please provide Email and Password.",
    })
  }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(Email)){
      return res.status(400).json({
        success : false ,
        message: "Invalid Email Format .",
    }) 
    };

    const user = await User.findOne({ Email });
    if(!user){
        return res.status(400).json({
        success : false ,
         message: "Invalid credentials.",
    }) 
    }
    const ispasswordMitched = await bcrypt.compare(password,user.password);
    if(!ispasswordMitched){
        return res.status(400).json({
         success : false ,
         message: "Invalid credentials.",
    }) 
    }
     generateJWTToken(user,  "User Logged In SuccessFully " ,200 , res );
  });

  export const Signout = catchAsyncError(async(req,res,next) =>{
    res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
     sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      secure: process.env.NODE_ENV === "production",
})
    .json({
        success: true,
        message:" User logged out Successfully "
        
    });
  })
   

  export const getUser = catchAsyncError(async(req,res,next) =>{
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    })
  })

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { FullName, Email } = req.body || {};

  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  if (!FullName || !Email || FullName.trim().length === 0 || Email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "FullName and Email can't be empty",
    });
  }

  const Avatar = req?.files?.Avatar;
  let cloudinaryResponse;

  if (Avatar) {
    try {
      const oldAvatarPublicId = req.user?.Avatar?.public_id;
      if (oldAvatarPublicId) {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }

      cloudinaryResponse = await cloudinary.uploader.upload(Avatar.tempFilePath, {
        folder: "chat_App",
        transformation: [
          { width: 300, height: 300, crop: "limit", quality: "auto", fetch_format: "auto" }
        ],
      });
    } catch (error) {
      console.error("Cloudinary Upload Error", error);
      return res.status(500).json({
        success: false,
        message: "Avatar could not be uploaded",
      });
    }
  }

  let data = { FullName, Email };

  if (cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url) {
    data.Avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find().select("-password"); // password remove kardo
  res.status(200).json({
    success: true,
    users,
  });
});