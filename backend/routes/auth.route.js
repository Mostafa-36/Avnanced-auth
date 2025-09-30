import express from "express";

import {
  checkAuth,
  forgotPassword,
  handleFacebookCallback,
  handleGoogleCallback,
  handleXCallback,
  login,
  logout,
  logoutOtherSessions,
  redirectToFacebook,
  redirectToGoogle,
  redirectToX,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";

import protect from "../middlewares/protect.js";
import { idempotency } from "../middlewares/idempotency.js";

const router = express.Router();

router.post("/signup", idempotency, signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check-auth", protect, checkAuth);

router.post("/verify-email", idempotency, verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", idempotency, resetPassword);

router.get("/google", redirectToGoogle);
router.get("/google/callback", handleGoogleCallback);

router.get("/facebook", redirectToFacebook);
router.get("/facebook/callback", handleFacebookCallback);

router.get("/x", redirectToX);
router.get("/x/callback", handleXCallback);

router.delete("/sessions/others", protect, logoutOtherSessions);

export default router;
