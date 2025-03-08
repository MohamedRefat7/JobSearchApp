import { compare, hash } from "../../utils/hashing/hash.js";
import { asyncHandler } from "./../../utils/errorHandeling/asyncHandler.js";
import Randomstring from "randomstring";
import User from "./../../DB/models/user.model.js";
import { OTPS, providers, subjects } from "../../utils/enum/enum.js";
import { eventEmitter } from "./../../utils/emails/emailEvent.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import OTP from "../../DB/models/otp.schema.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, mobileNumber, DOB, role } =
    req.body;
  const userExist = await User.findOne({ email });
  if (userExist) return next(new Error("User already exists", { cause: 400 }));

  const otpCode = Randomstring.generate({ length: 6, charset: "numeric" });
  const hashOTP = hash({ plainText: otpCode });
  await OTP.create({
    email,
    otps: [{ code: hashOTP, type: OTPS.confrimEmail }],
  });
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    DOB,
    mobileNumber,
    role,
  });
  eventEmitter.emit("sendEmail", email, otpCode, subjects.register);
  res.status(201).json({ sucess: true, message: "OTP sent successfully" });
});

export const confirmOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord || otpRecord.otps.length === 0) {
    return next(new Error("OTP not found", { cause: 404 }));
  }

  const isMatch = await compare({
    plainText: otp,
    hash: otpRecord.otps[0].code,
  });
  if (!isMatch) return next(new Error("Invalid OTP", { cause: 400 }));

  user.isConfirmed = true;
  await user.save();

  await OTP.deleteOne({ email });

  res
    .status(200)
    .json({ success: true, message: "Email confirmed successfully" });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, isConfirmed: true }).select(
    "+password"
  );
  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (user.provider !== providers.system)
    return next(
      new Error("please sign in with system account ", { cause: 404 })
    );

  const passwordMatch = await compare({
    plainText: password,
    hash: user.password,
  });
  if (!passwordMatch)
    return next(new Error("Invalid password", { cause: 400 }));

  if (user.isConfirmed === false)
    return next(new Error("please confirm your email", { cause: 400 }));

  res.status(200).json({
    sucess: true,
    message: "User logged in successfully",
    accessToken: generateToken({
      payload: { id: user._id },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      },
    }),
    refreshToken: generateToken({
      payload: { id: user._id },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      },
    }),
  });
});

export const signupWithGmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const payload = await verify();
  console.log("Google Token Audience:", payload.aud);
  console.log("Expected Audience (CLIENT_ID):", process.env.CLIENT_ID);

  if (!payload.email_verified)
    return next(new Error("Email is not verified", { cause: 400 }));
  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      email: payload.email,
      userName: payload.name,
      image: payload.picture,
      provider: providers.google,
      isActivated: true,
      firstName: payload.given_name,
      lastName: payload.family_name,
      DOB: payload.birthdate,
      isConfirmed: true,
    });
  }
  if (user.provider !== providers.google) {
    return next(new Error("invalid provider", { cause: 400 }));
  }

  res.status(200).json({
    success: true,
    message: "New access token generated successfully",
    newAccessToken: generateToken({
      payload: { id: user._id },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      },
    }),
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const otp = Randomstring.generate({ length: 6, charset: "numeric" });
  const hashOTP = hash({ plainText: otp });
  await OTP.create({
    email,
    otps: [{ code: hashOTP, type: OTPS.forgetPassword }],
  });
  eventEmitter.emit("sendEmail", email, otp, subjects.forgetPass);
  return res
    .status(200)
    .json({ success: true, message: "OTP sent successfully" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) return next(new Error("OTP not found", { cause: 404 }));

  const isMatch = await compare({
    plainText: otp,
    hash: otpRecord.otps.find((otp) => otp.type === OTPS.forgetPassword).code,
  });
  if (!isMatch) return next(new Error("Invalid OTP", { cause: 400 }));

  const hashPassword = hash({ plainText: password });
  await User.updateOne({ email }, { password: hashPassword });

  await OTP.deleteOne({ email });
  return res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  const payload = verifyToken({ token: refreshToken });
  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  res.status(200).json({
    success: true,
    message: "New access token generated successfully",
    newAccessToken: generateToken({
      payload: { id: user._id },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      },
    }),
  });
});
