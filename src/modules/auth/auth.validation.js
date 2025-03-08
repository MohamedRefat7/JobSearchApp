import joi from "joi";

export const signupSchema = joi
  .object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    mobileNumber: joi.string().required(),
    DOB: joi.date().required(),
    role: joi
      .string()
      .valid("admin", "user", "companyHR", "companyOwner")
      .optional(),
  })
  .required();

export const confirmOTP = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const signupWithGmailSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const forgotPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const refreshTokenSchema = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();
