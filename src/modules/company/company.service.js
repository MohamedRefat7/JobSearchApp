import Job from "../../DB/models/job.model.js";
import User from "../../DB/models/user.model.js";
import Company from "../../DB/models/company.model.js";
import { roles } from "../../utils/enum/enum.js";
import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import {
  defaultPublicId,
  defaultSecure_url,
} from "../../DB/models/user.model.js";
import exceljs from "exceljs";
import Application from "../../DB/models/application.model.js";
import fs from "fs";
import path from "path";

export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
  } = req.body;

  const companyExists = await Company.findOne({ companyEmail });
  if (companyExists)
    return next(new Error("Company already exists", { cause: 400 }));

  const company = await Company.create({
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
    CreatedBy: req.user._id,
  });

  return res
    .status(201)
    .json({ success: true, message: "Company added successfully", company });
});

export const updateCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  if (company.CreatedBy.toString() !== req.user._id.toString())
    return next(
      new Error("You are not allowed to update this company", { cause: 403 })
    );

  if (req.body.legalAttachment)
    return next(
      new Error("legalAttachment is not allowed to update", { cause: 400 })
    );

  const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Company updated successfully",
    company: updatedCompany,
  });
});

export const softDeleteCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  if (
    company.CreatedBy.toString() !== req.user._id.toString() &&
    req.user.role !== roles.admin
  )
    return next(
      new Error("You are not allowed to update this company", { cause: 403 })
    );

  await Company.updateOne(
    { _id: companyId },
    { isFreezed: true, deletedAt: Date.now() },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Company soft deleted successfully" });
});

export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId).populate("jobs");

  if (!company) return next(new Error("Company not found", { cause: 404 }));
  return res.status(200).json({
    success: true,
    message: "Company and related jobs found successfully",
    data: company,
  });
});

export const searchCompany = asyncHandler(async (req, res, next) => {
  const { CompanyName } = req.body;
  if (!CompanyName)
    return next(new Error("company name is required", { cause: 400 }));

  const company = await Company.find({
    companyName: { $regex: `^${CompanyName}`, $options: "i" },
  });

  if (!company) return next(new Error("Company not found", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "Company found successfully",
    data: company,
  });
});

export const uploadCompanyLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  if (!companyId)
    return next(new Error("company id is required", { cause: 400 }));

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // Cloudinary Upload
  const uploadImage = await cloudinary.uploader.upload_stream(
    { folder: `${process.env.FOLDER_NAME}/company/${company._id}/logo` },
    (error, result) => {
      if (error)
        return next(new Error("Cloudinary upload failed", { cause: 500 }));
      company.Logo = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
      company.save();
      return res.status(200).json({
        success: true,
        message: "Company logo uploaded successfully",
        data: company,
      });
    }
  );
  uploadImage.end(req.file.buffer);
});

export const uploadCompanyCoverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  if (!companyId)
    return next(new Error("company id is required", { cause: 400 }));

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (company.CreatedBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to update this company", { cause: 403 })
    );
  }

  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  const uploadImage = await cloudinary.uploader.upload_stream(
    { folder: `${process.env.FOLDER_NAME}/company/${company._id}/logo` },
    (error, result) => {
      if (error)
        return next(new Error("Cloudinary upload failed", { cause: 500 }));
      company.coverPic = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
      company.save();
      return res.status(200).json({
        success: true,
        message: "Company cover picture uploaded successfully",
        data: company,
      });
    }
  );
  uploadImage.end(req.file.buffer);
});

export const deleteCompanyLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  if (!companyId)
    return next(new Error("company id is required", { cause: 400 }));

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (!company.Logo || !company.Logo.public_id)
    return next(new Error("company logo not found", { cause: 404 }));

  await cloudinary.uploader.destroy(company.Logo.public_id);

  company.Logo = { secure_url: defaultSecure_url, public_id: defaultPublicId };
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company logo deleted successfully",
    data: company,
  });
});

export const deleteCompanyCoverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  if (!companyId)
    return next(new Error("company id is required", { cause: 400 }));

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (!company.coverPic || !company.coverPic.public_id)
    return next(new Error("company cover picture not found", { cause: 404 }));

  await cloudinary.uploader.destroy(company.coverPic.public_id);

  company.coverPic = {
    secure_url: defaultSecure_url,
    public_id: defaultPublicId,
  };
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company cover picture deleted successfully",
    data: company,
  });
});

export const getApplicationsExcel = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const { date } = req.query;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const applications = await Application.find({
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .populate({
      path: "userId",
      select: "firstName lastName email mobileNumber",
    })
    .sort({ createdAt: -1 })
    .lean();

  if (!applications.length)
    return next(
      new Error("No applications found for this date", { cause: 404 })
    );

  const dir = path.join(process.cwd(), "applications");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  worksheet.columns = [
    { header: "User Name", key: "userName", width: 25, font: { bold: true } },
    { header: "Email", key: "email", width: 30, font: { bold: true } },
    {
      header: "Mobile Number",
      key: "mobileNumber",
      width: 20,
      font: { bold: true },
    },
    {
      header: "Application Date",
      key: "createdAt",
      width: 25,
      font: { bold: true },
    },
  ];

  applications.forEach((application) => {
    worksheet.addRow({
      userName: `${application.userId.firstName} ${application.userId.lastName}`,
      email: application.userId.email,
      mobileNumber: application.userId.mobileNumber,
      createdAt: application.createdAt.toISOString(),
    });
  });

  const filePath = path.join(dir, `${company._id}_${date}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  res.download(filePath, `applications_${date}.xlsx`, (err) => {
    if (err) return next(new Error("Error downloading file", { cause: 500 }));

    fs.unlinkSync(filePath);
  });

  return res
    .status(200)
    .json({ success: true, message: "Applications downloaded successfully" });
});
