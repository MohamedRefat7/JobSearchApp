import User from "../../DB/models/user.model.js";
import { verifyToken } from "../../utils/token/token.js";

const socketAuth = async (socket, next) => {
    const authorization = socket.handshake.auth.authorization;
    if (!authorization) return next(new Error("Token is required"));
    if (!authorization.startsWith("Bearer")) return next(new Error("Invalid Token"));

    const token = authorization.split(" ")[1];
    const decoded = verifyToken({ token });
    const user = await User.findById(decoded.id).select("+password +changedAt role");
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (user.changedAt && user.changedAt.getTime() >= decoded.iat * 1000) {
        return next(new Error("Token is expired"));
    }

    socket.user = user;
    socket.id = user.id;
    return next();
};

export default socketAuth;