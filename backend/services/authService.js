import { config } from "dotenv";
import AppError from "../errors/AppError.js";
import { User } from "../models/user.model.js";
import generateOTP from "../utils/generateOTP.js";

import { redis } from "../lib/redisClient.js";
import Session from "../models/session.model.js";
import { emailQueue } from "../queues/emailQueue.js";
import generateRandomToken from "../utils/generateRandomToken.js";
import otpKey from "../utils/otpKey.js";

config();

export const authService = {
  signup: async ({ email, password, name }) => {
    if (!email || !password || !name)
      throw new AppError("provide all fields", 400);

    const existingUser = await User.findOne({ email });

    if (existingUser) throw new AppError("User already exists!", 400);

    const verificationToken = generateOTP();

    const newUser = User({
      email,
      name,
      password,
    });

    await newUser.validate();

    const payload = JSON.stringify({
      email,
      name,
      password,
    });

    await redis.setEx(otpKey(verificationToken, email), 3600, payload);
    await emailQueue.add("sendVerificationEmail", {
      email,
      verificationToken,
    });
  },

  verifyEmail: async ({ otp, email }) => {
    if (!otp) throw new AppError("please provide code", 400);

    const key = otpKey(otp, email);
    const data = await redis.get(key);

    if (!data) throw new AppError("OTP invalid or expired", 400);

    const userData = JSON.parse(data);

    const newUser = User(userData);
    newUser.lastLogin = Date.now();

    await newUser.save();

    await redis.del(key);
    await emailQueue.add("sendWelcomeEmail", {
      email: newUser.email,
      name: newUser.name,
    });

    return {
      user: newUser,
    };
  },

  login: async ({ email, password }) => {
    if (!email || !password)
      throw new AppError("Please provide email and password", 400);

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser || !(await existingUser.validatePassword(password)))
      throw new AppError("Invalid email or password", 401);

    existingUser.lastLogin = new Date();

    await existingUser.save({ validateBeforeSave: false });

    return {
      user: existingUser,
    };
  },

  logout: async (token_identifier) => {
    await Session.deleteOne({ token_identifier });
  },

  checkAuth: async (userId, refreshToken) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found, please login again", 404);
    }

    const session = await Session.findOne({
      token_identifier: refreshToken,
      user_id: userId,
    });

    if (!session) {
      throw new AppError("Session expired, please login again", 401);
    }

    return { user };
  },

  forgotPassword: async ({ email, resetUrlBuilder }) => {
    if (!email) throw new AppError("Please provide email", 400);

    const user = await User.findOne({ email });

    if (!user) throw new AppError("User not found", 404);

    const resetToken = generateRandomToken(20);

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = resetUrlBuilder(resetToken);

    await emailQueue.add("sendPasswordResetEmail", { email, resetUrl });
  },

  resetPassword: async ({ token, password }) => {
    if (!token) throw new AppError("please provide token", 400);

    if (!password) throw new AppError("please provide password", 400);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gte: new Date() },
    });

    if (!user) throw new AppError("Invalid or expired token", 400);

    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordToken = undefined;
    user.password = password;

    await user.save();

    await emailQueue.add("sendResetPasswordEmail", { email: user.email });
  },

  logoutOtherSessions: async ({ password, user, refreshToken }) => {
    if (!(await user.validatePassword(password))) {
      throw new AppError("Wrong password, please enter correct password", 401);
    }

    await Session.deleteMany({
      user_id: user._id,
      token_identifier: { $ne: refreshToken },
    });
  },
};
