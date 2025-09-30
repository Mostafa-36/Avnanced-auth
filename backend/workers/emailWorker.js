import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../integrations/EmailService/emails.js";
import { emailQueue } from "../queues/emailQueue.js";

emailQueue.process("sendVerificationEmail", async (job) => {
  await sendVerificationEmail(job.data.email, job.data.verificationToken);
});

emailQueue.process("sendResetPasswordEmail", async (job) => {
  await sendResetSuccessEmail(job.data.email);
});

emailQueue.process("sendWelcomeEmail", async (job) => {
  await sendWelcomeEmail(job.data.email, job.data.name);
});

emailQueue.process("sendPasswordResetEmail", async (job) => {
  await sendPasswordResetEmail(job.data.email, job.data.resetUrl);
});

emailQueue.on("completed", (job) => {
  console.log(`Job ${job.name} completed`);
});

emailQueue.on("failed", (job, err) => {
  console.error(`Job ${job.name} failed:`, err);
});
