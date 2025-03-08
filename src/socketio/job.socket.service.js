import User from './../DB/models/user.model.js';
import Chat from './../DB/models/chat.model.js';
import { asyncHandler } from './../utils/errorHandeling/asyncHandler.js';


export const jobSocketHandler = asyncHandler((socket, io) => {

    socket.on("newApplication", ({ hrIds, jobTitle, jobId, applicantId }) => {
        hrIds.forEach((hrId) => {
            io.to(hrId.toString()).emit("newApplication", {
                message: `New application submitted for ${jobTitle}`,
                jobId,
                applicantId,
            });
        });
    });
})

export const sendMessage = asyncHandler(function (socket, io) {
    return async (message, to) => {
        const { receiverId } = to;
        const { content } = message;

        if (!socket.user._id || !receiverId) {
            throw new Error("Invalid users", { cause: 400 });
        }

        const receiverObjectId = mongoose.Types.ObjectId.isValid(receiverId)
            ? new mongoose.Types.ObjectId(receiverId)
            : null;

        if (!receiverObjectId) {
            throw new Error("Invalid receiverId format", { cause: 400 });
        }

        const receiver = await User.findById(receiverObjectId);
        if (!receiver) throw new Error("User not found", { cause: 404 });

        const usersArray = [socket.user._id, receiverObjectId];

        let chat = await Chat.findOne({ users: { $all: usersArray } });

        if (!chat) {
            if (!socket.user.role.includes("hr") && !socket.user.role.includes("company_owner")) {
                socket.emit("error", "Only HR or company owner can start a chat.");
                return;
            }

            chat = await Chat.create({
                users: usersArray,
                messages: [{ sender: socket.user._id, content }],
                initiatedBy: socket.user.role.includes("hr") || socket.user.role.includes("company_owner") ? socket.user._id : null
            });
            return next(new Error("Database error while creating chat", { cause: 500 }));
        } else {
            chat.messages.push({ sender: socket.user._id, content });
            await chat.save();
        }

        io.to(receiverId).emit("receiveMessage", { message, from: socket.user._id });
    }
})
