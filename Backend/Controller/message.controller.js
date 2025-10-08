import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../utils/socket.js";

// ✅ Get all users except logged in user
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

  res.status(200).json({
    success: true,
    users: filteredUsers,
  });
});

// ✅ Get messages between logged in user and another user
export const getMessage = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;
  const myid = req.user._id;

  if (!mongoose.isValidObjectId(receiverId)) {
    return res.status(400).json({ success: false, message: "Invalid receiver id format." });
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ success: false, message: "Receiver Id is not valid." });
  }

  const messages = await Message.find({
    $or: [
      { sender: myid, receiver: receiverId },
      { sender: receiverId, receiver: myid },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});


export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { text, duration } = req.body;
  const media = req?.files?.media;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  // ✅ Validate receiverId
  if (!mongoose.isValidObjectId(receiverId)) {
    return res.status(400).json({ success: false, message: "Invalid receiver id format." });
  }

  // ✅ Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ success: false, message: "Receiver not found." });
  }

  // ✅ Text / Media validation
  const sanitizedText = text?.trim() || "";
  if (!sanitizedText && !media) {
    return res.status(400).json({ success: false, message: "Cannot send empty message." });
  }

  let mediaUrl = "";
  let mediaType = null;

  // ✅ Handle media upload
  if (media) {
    try {
      // 🆕 MimeType check
      if (media.mimetype.startsWith("image/")) mediaType = "image";
      else if (media.mimetype.startsWith("video/")) mediaType = "video";
      else if (media.mimetype.startsWith("audio/")) mediaType = "audio";

      const uploadResponse = await cloudinary.uploader.upload(media.tempFilePath, {
        // ⚡ Cloudinary me audio ko "video" type me upload karna padta hai
        resource_type: mediaType === "audio" ? "video" : "auto",
        folder: "chatapp/media",
        transformation: [
          { width: 1000, height: 1000, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      mediaUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload media. Please try again.",
      });
    }
  }

  // ✅ Create new message
  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    text: sanitizedText,
    media: mediaUrl,
    mediaType: mediaType || null,
    duration: duration ? Number(duration) : null, // 🆕 voice note duration
  });

  // ✅ Emit real-time message via Socket.io
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage);
});

export const ClearChat = catchAsyncError(async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const authUserId = req.user._id;

    const result = await Message.deleteMany({
      $or: [
        { sender: authUserId, receiver: userId },
        { sender: userId, receiver: authUserId }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Chat Cleared",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("You are not able to delete your chat:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error, Please Try Again"
    });
  }
});
