import joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";

export const banAndUnbanUserSchema = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const banAndUnbanCompanySchema = joi
  .object({
    companyId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const approveSchema = joi
  .object({
    companyId: joi.custom(isValidObjectId).required(),
  })
  .required();
