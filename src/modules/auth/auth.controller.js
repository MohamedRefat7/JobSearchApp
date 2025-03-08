import { Router } from "express";
import * as authService from '../auth/auth.service.js'
import * as authShemas from '../auth/auth.validation.js'
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post('/signup', validation(authShemas.signupSchema), authService.signup)

router.post('/confirm-otp', validation(authShemas.confirmOTP), authService.confirmOTP)

router.post('/login', validation(authShemas.loginSchema), authService.login)

router.post('/signup-with-gmail', validation(authShemas.signupWithGmailSchema), authService.signupWithGmail)

router.post('/forgot-password', validation(authShemas.forgotPasswordSchema), authService.forgotPassword)

router.post('/reset-password', validation(authShemas.resetPasswordSchema), authService.resetPassword)

router.post('/refresh-token', validation(authShemas.refreshTokenSchema), authService.refreshToken)
export default router;