import User from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js";
import Company from "./../../DB/models/company.model.js";

export const banAndUnbanUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (user.isBanned) {
    user.isBanned = false;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User Unbanned successfully" });
  } else {
    user.bannedAt = Date.now();
    user.isBanned = true;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User Banned successfully" });
  }
});

export const banAndUnbanCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (company.isBanned) {
    company.isBanned = false;
    await company.save();
    return res
      .status(200)
      .json({ success: true, message: "Company Unbanned successfully" });
  } else {
    company.bannedAt = Date.now();
    company.isBanned = true;
    await company.save();
    return res
      .status(200)
      .json({ success: true, message: "Company Banned successfully" });
  }
});

export const approve = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (company.approvedByAdmin)
    return next(new Error("company already approved", { cause: 400 }));

  company.approvedByAdmin = true;
  await company.save();
  return res
    .status(200)
    .json({ success: true, message: "company approved successfully" });
});
