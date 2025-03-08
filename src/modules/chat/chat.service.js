import User from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js";
import Chat from "../../DB/models/chat.model.js";
import mongoose from "mongoose";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId, message } = req.body;

  if (!mongoose.isValidObjectId(receiverId)) {
    return next(new Error("Invalid receiver ID", { cause: 400 }));
  }

  const user = await User.findById(receiverId);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // Check if a chat already exists between these users
  let chat = await Chat.findOne({
    users: { $all: [req.user._id, receiverId] },
  });

  if (!chat) {
    // If no chat exists, create a new chat document
    chat = await Chat.create({
      users: [req.user._id, receiverId],
      messages: [{ sender: req.user._id, message }],
    });
  } else {
    // If chat exists, add new message to messages array
    chat.messages.push({ sender: req.user._id, message });
    await chat.save();
  }

  return res.status(200).json({
    success: true,
    message: "Message sent successfully",
    data: chat,
  });
});

export const getChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return next(new Error("Invalid User ID", { cause: 400 }));
  }

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // Find the chat document between the users
  const chat = await Chat.findOne({ users: { $all: [req.user._id, userId] } })
    .populate("users", "firstName lastName profilePicture")
    .sort({ "messages.timestamp": 1 });

  if (!chat) return next(new Error("Chat not found", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "Chat found successfully",
    data: chat,
  });
});
