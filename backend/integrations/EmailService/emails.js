import { config } from "dotenv";
import { EmailService, sender } from "./EmailService.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

config();

const emailService = new EmailService({
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    await emailService.sendMail({
      from: sender.email,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (error) {
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await emailService.sendMail({
      from: sender.email,
      to: email,
      subject: "Welcome our new member",
      html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", name),
      category: "Email Verification",
    });
  } catch (error) {
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await emailService.sendMail({
      from: sender.email,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
  } catch (error) {
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    await emailService.sendMail({
      from: sender.email,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
