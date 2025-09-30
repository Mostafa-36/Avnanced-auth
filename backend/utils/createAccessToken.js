import JwtService from "../lib/JwtService.js";
import setTokenCookie from "./setTokenCookie.js";

const jwtService = new JwtService(process.env.JWT_SECRETKEY, "15m");

export default (userId, res) => {
  const accessToken = jwtService.sign(userId);
  setTokenCookie(res, "accessToken", accessToken, 15 * 60 * 1000);
};
