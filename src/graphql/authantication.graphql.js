import User from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/token.js";

export const isAuthenticated = (roles) => {
    return (resolver) => {
        return async (parent, args, context) => {
            const { authorization } = context;
            if (!authorization) throw new Error("Token is required", { cause: 401 });
            if (!authorization.startsWith('Bearer')) throw new Error("invalid Token", { cause: 401 });
            const token = authorization.split(' ')[1];
            const decoded = verifyToken({ token });
            const user = await User.findById(decoded.id).select("+password +changedAt").lean();
            if (!user) throw new Error("User not found", { cause: 400 });
            if (user.changedAt && user.changedAt.getTime() >= decoded.iat * 1000) {
                throw new Error("Token is expired", { cause: 401 });
            }
            if (roles?.length && !roles.includes(user.role)) throw new Error("forbidden!!", { cause: 403 });
            return resolver(parent, args, context);
        };
    }
}