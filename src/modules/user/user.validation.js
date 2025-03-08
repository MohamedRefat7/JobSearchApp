import joi from "joi";
import { genders } from "../../utils/enum/enum.js";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";
export const updateAccountSchema = joi
  .object({
    mobileNumber: joi.string(),
    DOB: joi.date(),
    firstName: joi.string(),
    lastName: joi.string(),
    gender: joi.string().valid(...Object.values(genders)),
  })
  .required();

export const getProfileAnotherUserSchema = joi
  .object({
    profileId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const updatePasswordSchema = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().not(joi.ref("oldPassword")).required(),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();
