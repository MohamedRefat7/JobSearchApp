import joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";

export const sendMessageSchema = joi
  .object({
    receiverId: joi.custom(isValidObjectId).required(),
    message: joi.string().required(),
  })
  .required();

export const getChatSchema = joi.object({}).unknown(true);
