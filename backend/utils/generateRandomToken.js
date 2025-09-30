import crypto from "crypto";
export default function generateRefreshToken(number) {
  return crypto.randomBytes(number).toString("hex");
}

// uuid
