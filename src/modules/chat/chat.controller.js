import { Router } from "express";
import isAuthenticated from "../../middlewares/authentication.middleware.js";
import * as chatService from "../chat/chat.service.js";
import * as chatSchemas from "./chat.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/sendMessage",
  isAuthenticated,
  validation(chatSchemas.sendMessageSchema),
  chatService.sendMessage
);

router.get("/:userId", isAuthenticated, chatService.getChat);

export default router;
