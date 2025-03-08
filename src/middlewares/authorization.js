const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new Error("Unauthorized", { cause: 403 }));
        }
        return next();
    }
}

export default isAuthorized;
