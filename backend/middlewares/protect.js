import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { User } from "../models/user.model.js";
import JwtService from "../lib/JwtService.js";
import Session from "../models/session.model.js";
import createAccessToken from "../utils/createAccessToken.js";

const jwtService = new JwtService(process.env.JWT_SECRETKEY, "7d");

const protect = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!refreshToken)
    return next(new AppError("No session found, please login again", 401));

  let decoded;

  try {
    decoded = await jwtService.verify(accessToken);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const existingSession = await Session.findOne({
        token_identifier: refreshToken,
      });

      if (!existingSession)
        return next(
          new AppError("Session has been expired, please login again", 401)
        );

      const freshUser = await User.findById(existingSession?.user_id);

      if (!freshUser) {
        return next(new AppError("No user found, please login again", 400));
      }

      createAccessToken(freshUser._id, res);
      req.user = freshUser;

      return next();
    }

    return next(new AppError("Invalid access token, Please log in again", 401));
  }

  const freshUser = await User.findById(decoded?.id).select("+password");

  if (!freshUser) {
    return next(new AppError("No user found, please login again", 400));
  }

  req.user = freshUser;

  next();
});

export default protect;
