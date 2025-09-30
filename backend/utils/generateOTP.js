import crypto from "crypto";

export default function generateOTP() {
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
}
