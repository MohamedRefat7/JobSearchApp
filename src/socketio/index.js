import { Server } from "socket.io";
import { jobSocketHandler } from "./job.socket.service.js";
import socketAuth from "./middleware/authorization.socket.js";

export const runSocket = function (server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User connected", socket.user._id);
        jobSocketHandler(socket, io);
        socket.on("sendMessage", sendMessage(socket, io));

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.user._id);
        });
    });

    return io;
};

export default runSocket;
