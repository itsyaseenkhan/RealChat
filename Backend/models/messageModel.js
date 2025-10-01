import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  media: {
    type: String,

  },

  mediaType:{
    type: String,
    enum : ["image", "audio", "video",null],
    default: null,
  },
  
  duration:{
    type: Number ,
    default:null, 
  }

}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
