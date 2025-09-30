import { config } from "dotenv";

config();
export const xConfig = {
  provider: "x",
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET,
  callbackUrl: process.env.X_CALLBACK_URL,
  codeVerifier: process.env.X_CODE_VERIFIER,
};
