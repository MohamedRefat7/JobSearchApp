import joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";

export const addCompanySchema = joi
  .object({
    companyName: joi.string().min(3).required(),
    companyEmail: joi.string().email().required(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi
      .string()
      .pattern(/^[0-9]+-[0-9]+$/)
      .required(),
  })
  .required();

export const updateCompanySchema = joi
  .object({
    companyId: joi.custom(isValidObjectId).required(),
    companyName: joi.string().min(3),
    companyEmail: joi.string().email(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string().pattern(/^[0-9]+-[0-9]+$/),
  })
  .required();

export const getCompanyWithJobsSchema = joi.object({
  companyId: joi.custom(isValidObjectId).required(),
});

export const getApplicationsExcel = joi
  .object({
    companyId: joi.custom(isValidObjectId).required(),
    date: joi.date().required(),
  })
  .required();
