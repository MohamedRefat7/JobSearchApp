import joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";
import { allStatus } from "../../utils/enum/enum.js";

export const addJobSchema = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().required(),
    workingTime: joi.string().required(),
    seniorityLevel: joi.string().required(),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    companyId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const updateJobSchema = joi
  .object({
    jobId: joi.custom(isValidObjectId).required(),
    jobTitle: joi.string(),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    companyId: joi.custom(isValidObjectId),
  })
  .required();

export const getJobsSchema = joi
  .object({
    companyId: joi.custom(isValidObjectId).required(),
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
  })
  .required();

export const getMatchedJobsSchema = joi.object({
  page: joi.number().optional(),
  limit: joi.number().optional(),
  workingTime: joi.string().optional(),
  seniorityLevel: joi.string().optional(),
  jobLocation: joi.string().optional(),
  jobTitle: joi.string().optional(),
  technicalSkills: joi
    .alternatives()
    .try(joi.array().items(joi.string()), joi.string())
    .optional(),
});

export const getJobApplicationsSchema = joi
  .object({
    jobId: joi.custom(isValidObjectId).required(),
    page: joi.number(),
    limit: joi.number(),
  })
  .required();

export const AcceptOrRejectApplicationSchema = joi
  .object({
    applicationId: joi.custom(isValidObjectId).required(),
    status: joi
      .string()
      .valid(...Object.values(allStatus))
      .required(),
  })
  .required();
