import Session from "../models/session.model.js";
import generateRandomToken from "./generateRandomToken.js";
import setTokenCookie from "./setTokenCookie.js";

export default async (userId, req, res) => {
  const refreshToken = generateRandomToken(64);

  await Session.create({
    user_id: userId,
    token_identifier: refreshToken,
    user_agent: req.headers["user-agent"],
    ip_address: req.ip,
  });

  setTokenCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
};
