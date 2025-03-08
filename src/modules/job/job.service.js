import Job from "../../DB/models/job.model.js";
import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js";
import Company from "./../../DB/models/company.model.js";
import Application from "./../../DB/models/application.model.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import io from "../../socketio/index.js";
import { eventEmitter } from "./../../utils/emails/emailEvent.js";
import { subjects } from "../../utils/enum/enum.js";

export const addJob = asyncHandler(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;

  const company = await Company.findById(companyId);

  if (!company) return next(new Error("company not found", { cause: 404 }));
  if (company.isFreezed)
    return next(new Error("company is not active", { cause: 400 }));

  if (
    !company.HRs.includes(req.user._id) &&
    company.CreatedBy.toString() !== req.user._id.toString()
  )
    return next(new Error("You are not authorized to add job", { cause: 403 }));

  const job = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
    addedBy: req.user._id,
  });

  return res
    .status(200)
    .json({ success: true, message: "Job added successfully", data: job });
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found", { cause: 404 }));

  if (job.addedBy.toString() !== req.user._id.toString())
    return next(
      new Error("You are not authorized to update this job", { cause: 403 })
    );

  const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: updatedJob,
  });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found", { cause: 404 }));

  const company = await Company.findById(job.companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  await Job.findByIdAndDelete(jobId);

  return res
    .status(200)
    .json({ success: true, message: "Job deleted successfully" });
});

export const getJobs = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const { page = 1, limit = 4, search } = req.query;

  let query = {};
  if (companyId) query.companyId = companyId;

  if (search) {
    const company = await Company.findOne({ companyName: search });
    if (!company) return next(new Error("Company not found", { cause: 404 }));
    query.companyId = company._id;
  }
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .paginate(page, limit);

  res
    .status(200)
    .json({ success: true, message: "Jobs found successfully", ...jobs });
});

export const getMatchedJobs = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 4,
    workingTime,
    seniorityLevel,
    jobLocation,
    jobTitle,
    technicalSkills,
  } = req.query;

  let query = {};

  if (workingTime) query.workingTime = workingTime;
  if (seniorityLevel) query.seniorityLevel = seniorityLevel;
  if (jobLocation) query.jobLocation = jobLocation;
  if (jobTitle) query.jobTitle = jobTitle;

  if (technicalSkills) {
    query.technicalSkills = {
      $in: Array.isArray(technicalSkills)
        ? technicalSkills
        : technicalSkills.split(",").map((skill) => skill.trim()),
    };
  }

  // Fetch jobs with pagination
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Jobs found successfully",
    jobs,
  });
});

export const getJobApplications = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { page = 1, limit = 4 } = req.query;

  const job = await Job.findById(jobId).populate("companyId");
  if (!job) return next(new Error("Job not found", { cause: 404 }));

  const company = job.companyId;
  if (
    !company ||
    (!company.HRs.includes(req.user._id) &&
      company.CreatedBy.toString() !== req.user._id.toString())
  )
    return next(
      new Error("You are Unauthorized to view this job applications", {
        cause: 403,
      })
    );

  const applications = await Application.find({ jobId })
    .populate("user", "firstName lastName email profilePic -_id")
    .sort({ createdAt: -1 })
    .paginate(page, limit);
  if (!applications)
    return next(new Error("Job applications not found", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "Job applications found successfully",
    data: applications,
  });
});

export const applyJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId).populate("companyId");
  if (!job) return next(new Error("Job not found", { cause: 404 }));
  if (!req.file) return next(new Error("CV file is required", { cause: 400 }));

  const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: "job_applications",
  });

  const application = await Application.create({
    jobId,
    userId: req.user._id,
    userCV: {
      secure_url: uploadedFile.secure_url,
      public_id: uploadedFile.public_id,
    },
    status: "pending",
  });

  const hrIds = job.companyId.HRs.map((hr) => hr.toString());

  io.emit("newApplication", {
    hrIds,
    jobTitle: job.jobTitle,
    jobId: job._id,
    applicantId: req.user._id,
  });

  return res.status(200).json({
    success: true,
    message: "Job applied successfully",
    data: application,
  });
});

export const AcceptOrRejectApplication = asyncHandler(
  async (req, res, next) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return next(
        new Error("Invalid status, must be 'accepted' or 'rejected'", {
          cause: 400,
        })
      );
    }

    const application = await Application.findById(applicationId)
      .populate("jobId")
      .populate("userId");
    if (!application)
      return next(new Error("Application not found", { cause: 404 }));

    application.status = status;
    await application.save();

    if (status === "accepted") {
      eventEmitter.emit(
        "sendEmail",
        application.userId.email,
        "Congratulations! Your application is accepted",
        subjects.accepted
      );
    } else {
      eventEmitter.emit(
        "sendEmail",
        application.userId.email,
        "Sorry! Your application is rejected",
        subjects.rejected
      );
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  }
);
