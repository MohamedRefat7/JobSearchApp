import { Router } from "express";
import isAuthenticated from "./../../middlewares/authentication.middleware.js";
import * as userService from "../user/user.service.js";
import * as userSchemas from "../user/user.validation.js";
import isAuthorized from "./../../middlewares/authorization.js";
import { roles } from "../../utils/enum/enum.js";
import { validation } from "./../../middlewares/validation.middleware.js";
import { uploadCloud } from "../../utils/file uploading/multer.upload.js";
const router = Router();

router.patch(
  "/updateAccount",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user),
  validation(userSchemas.updateAccountSchema),
  userService.updateAccount
);

router.get(
  "/getAccount",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user),
  userService.getAccount
);

router.get(
  "/getProfileAnotherUser/:profileId",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user),
  validation(userSchemas.getProfileAnotherUserSchema),
  userService.getProfileAnotherUser
);

router.patch(
  "/updatePassword",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user),
  validation(userSchemas.updatePasswordSchema),
  userService.updatePassword
);

router.post(
  "/uploadProfilePicture",
  isAuthenticated,
  uploadCloud().single("image"),
  isAuthorized(roles.admin, roles.user),
  userService.uploadProfilePicture
);

router.post(
  "/uploadCoverPicture",
  isAuthenticated,
  uploadCloud().single("image"),
  isAuthorized(roles.admin, roles.user),
  userService.uploadCoverPicture
);

router.delete(
  "/deleteProfilePicture",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user),
  userService.deleteProfilePicture
);

router.delete(
  "/deleteCoverPicture",
  isAuthenticated,
  isAuthorized(roles.admin, roles.user),
  userService.deleteCoverPicture
);

router.delete(
  "/freezeAccount",
  isAuthenticated,
  isAuthorized(roles.admin),
  userService.freezeAccount
);

export default router;
