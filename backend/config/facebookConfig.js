import { config } from "dotenv";

config();
export const facebookConfig = {
  provider: "facebook",
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
};
