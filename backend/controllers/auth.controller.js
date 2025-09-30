import { config } from "dotenv";
import catchAsync from "../utils/catchAsync.js";

import crypto from "crypto";
import { facebookConfig } from "../config/facebookConfig.js";
import { googleConfig } from "../config/googleConfig.js";
import { xConfig } from "../config/xConfig.js";
import OAuthService from "../integrations/OAuthService.js";
import { facebookHandler } from "../providers/facebookHandler.js";
import { googleHandler } from "../providers/googleHandler.js";
import { xHandler } from "../providers/xHandler.js";
import { authService } from "../services/authService.js";
import createAccessToken from "../utils/createAccessToken.js";
import createRefreshToken from "../utils/createRefreshToken.js";
import { redis } from "../lib/redisClient.js";
import Session from "../models/session.model.js";

config();

const googleAuthService = new OAuthService(googleConfig, googleHandler);
const facebookAuthService = new OAuthService(facebookConfig, facebookHandler);
const xService = new OAuthService(xConfig, xHandler);

export const signup = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;

  await authService.signup({ email, password, name });

  const idempotencyKey = req.headers["idempotency-key"];

  await redis.setEx(
    idempotencyKey,
    120,
    JSON.stringify({
      status: 200,
      body: {
        success: true,
        message: "Verification code sent to email",
      },
    })
  );

  res.status(200).json({
    success: true,
    message: "Verification code sent to email",
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;

  const { user } = await authService.verifyEmail({ otp, email });

  await createRefreshToken(user._id, req, res);
  createAccessToken(user._id, res);

  const idempotencyKey = req.headers["idempotency-key"];

  await redis.setEx(
    idempotencyKey,
    120,
    JSON.stringify({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          lastLogin: user.lastLogin,
        },
      },
    })
  );

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      user: {
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin,
      },
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { user } = await authService.login({ email, password });

  await createRefreshToken(user._id, req, res);
  createAccessToken(user._id, res);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.cookies["refreshToken"]);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged Out successfully",
  });
});

export const checkAuth = catchAsync(async (req, res, next) => {
  const { user } = await authService.checkAuth(
    req?.user?._id,
    req.cookies["refreshToken"]
  );

  res.status(200).json({ success: true, user });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const resetUrlBuilder = (token) =>
    `${req.protocol}://${req.get("host")}/api/auth/reset-password/${token}`;

  await authService.forgotPassword({ email, resetUrlBuilder });

  res
    .status(200)
    .json({ success: true, message: "Password reset link sent to your email" });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  await authService.resetPassword({ token, password });

  const idempotencyKey = req.headers["idempotency-key"];

  await redis.setEx(
    idempotencyKey,
    120,
    JSON.stringify({ success: true, message: "Password reset successful" })
  );

  res.status(200).json({ success: true, message: "Password reset successful" });
});

export const redirectToGoogle = (req, res) => {
  const redirectUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleConfig.clientId}&` +
    `redirect_uri=${googleConfig.callbackUrl}&` +
    `response_type=code&` +
    `scope=openid%20email%20profile`;

  res.redirect(redirectUrl);
};

export const handleGoogleCallback = catchAsync(async (req, res, next) => {
  const code = req.query.code;
  const { user } = await googleAuthService.authenticate(code);
  const { refreshToken } = req.cookies;

  if (!(await Session.findOne({ token_identifier: refreshToken })))
    await createRefreshToken(user, req, res);
  createAccessToken(user, res);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const redirectToFacebook = (req, res) => {
  const redirectUrl =
    `https://www.facebook.com/v17.0/dialog/oauth?` +
    `client_id=${facebookConfig.clientId}&` +
    `redirect_uri=${encodeURIComponent(facebookConfig.callbackUrl)}&` +
    `scope=email,public_profile`;

  res.redirect(redirectUrl);
};

export const handleFacebookCallback = catchAsync(async (req, res, next) => {
  const code = req.query.code;

  const { user } = await facebookAuthService.authenticate(code);
  const { refreshToken } = req.cookies;

  if (!(await Session.findOne({ token_identifier: refreshToken })))
    await createRefreshToken(user._id, req, res);
  createAccessToken(user._id, res);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const redirectToX = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: xConfig.clientId,
    redirect_uri: xConfig.callbackUrl,
    scope: "users.read email",
    state,
    code_challenge: xConfig.codeVerifier,
    code_challenge_method: "plain",
  });

  const redirectUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  res.redirect(redirectUrl);
};

export const handleXCallback = catchAsync(async (req, res, next) => {
  const { code, state } = req.query;

  if (state !== req.cookies.oauthState) {
    return res.status(400).json({ error: "Invalid state" });
  }

  const { user } = await xService.authenticate(code);
  const { refreshToken } = req.cookies;

  if (!(await Session.findOne({ token_identifier: refreshToken })))
    await createRefreshToken(user._id, req, res);
  createAccessToken(user._id, res);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const logoutOtherSessions = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  await authService.logoutOtherSessions({
    password,
    user: req.user,
    refreshToken: req.cookies.refreshToken,
  });

  res.status(204).json({
    status: "success",
    message: "Logout has been successfully!",
  });
});
