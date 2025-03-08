import { Types } from "mongoose";
import joi from "joi";
export const validation = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        if (req.file || req.files?.length) {
            data.file = [req.file] || req.files;
        }
        const result = schema.validate(data, { abortEarly: false });
        if (result.error) {
            const messageList = result.error.details.map(err => err.message);
            return next(new Error(messageList, { cause: 400 }));
        }
        return next();
    }
}

export const isValidObjectId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) return true;
    return helper.message("Invalid Id");
}


