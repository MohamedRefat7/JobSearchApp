import { Router } from "express";
import isAuthenticated from "./../../middlewares/authentication.middleware.js";
import isAuthorized from "./../../middlewares/authorization.js";
import { roles } from "../../utils/enum/enum.js";
import * as adminService from "../admin/admin.service.js";
import { validation } from "./../../middlewares/validation.middleware.js";
import * as adminSchemas from "./admin.validation.js";

const router = Router();

router.patch(
  "/banAndUnbanUser/:userId",
  isAuthenticated,
  isAuthorized(roles.admin),
  validation(adminSchemas.banAndUnbanUserSchema),
  adminService.banAndUnbanUser
);

router.patch(
  "/banAndUnbanCompany/:companyId",
  isAuthenticated,
  isAuthorized(roles.admin),
  validation(adminSchemas.banAndUnbanCompanySchema),
  adminService.banAndUnbanCompany
);

router.patch(
  "/approve/:companyId",
  isAuthenticated,
  isAuthorized(roles.admin),
  validation(adminSchemas.approveSchema),
  adminService.approve
);

export default router;
