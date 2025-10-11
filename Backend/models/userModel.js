import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
      FullName: { type: String,
      required: true 
      },
        Email: { type: String,
        required: true,
        unique: true,
        },
        password: {
         type: String,
        required: true,     
        },
        Avatar: {
         public_id: String,
         url: String,
        },    
        resetPasswordToken: String,
        resetPasswordExpire: Date,  
 }
 ,
 { timestamps: true }
 );


 export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;