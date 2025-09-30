import AppError from "../errors/AppError.js";

import { redis } from "../lib/redisClient.js";
import catchAsync from "../utils/catchAsync.js";

export const idempotency = catchAsync(async (req, res, next) => {
  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return next(new AppError("Idempotency-Key is required", 400));
  }

  const cached = await redis.get(idempotencyKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    return res.status(parsed.status).json(parsed.body);
  }

  next();
});
