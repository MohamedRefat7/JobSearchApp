import { Router } from "express";
import isAuthenticated from "./../../middlewares/authentication.middleware.js";
import isAuthorized from "./../../middlewares/authorization.js";
import { roles } from "../../utils/enum/enum.js";
import { validation } from "./../../middlewares/validation.middleware.js";
import * as jobService from "../job/job.service.js";
import * as jobSchemas from "../job/job.validation.js";
import { uploadCloud } from "../../utils/file uploading/multer.upload.js";
const router = Router({ mergeParams: true });

router.post(
  "/addJob",
  isAuthenticated,
  isAuthorized(roles.companyHR, roles.companyOwner, roles.admin),
  validation(jobSchemas.addJobSchema),
  jobService.addJob
);

router.patch(
  "/updateJob/:jobId",
  isAuthenticated,
  isAuthorized(roles.companyOwner, roles.companyHR),
  validation(jobSchemas.updateJobSchema),
  jobService.updateJob
);

router.delete(
  "/deleteJob/:jobId",
  isAuthenticated,
  isAuthorized(roles.companyHR, roles.companyOwner),
  jobService.deleteJob
);

router.get(
  "/getJobs/:companyId",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user, roles.companyHR, roles.companyOwner),
  validation(jobSchemas.getJobsSchema),
  jobService.getJobs
);

router.get(
  "/getMatchedJobs",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user, roles.companyHR, roles.companyOwner),
  validation(jobSchemas.getMatchedJobsSchema),
  jobService.getMatchedJobs
);

router.get(
  "/:jobId/applications",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user, roles.companyHR, roles.companyOwner),
  validation(jobSchemas.getJobApplicationsSchema),
  jobService.getJobApplications
);

router.post(
  "/applyJob/:jobId",
  isAuthenticated,
  uploadCloud().single("CV"),
  isAuthorized(roles.user),
  jobService.applyJob
);

router.patch(
  "/AcceptOrRejectApplication/:applicationId",
  isAuthenticated,
  isAuthorized(roles.companyHR, roles.companyOwner),
  validation(jobSchemas.AcceptOrRejectApplicationSchema),
  jobService.AcceptOrRejectApplication
);

export default router;
