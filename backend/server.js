import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import handleGlobalError from "./middlewares/handleGlobalError.js";
import { connectRedis } from "./lib/redisClient.js";
import "./workers/emailWorker.js";

dotenv.config();

const app = express();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHTEXCEPTION");
  console.log(err.name, err.message);
  process.exist(1);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

const corsOptions = {
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
  credentials: false,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(morgan("dev"));
app.use(compression());
app.use(express.json(""));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(handleGlobalError);

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
  connectDB();
  connectRedis();
  console.log("server is running on port 5005");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLEDREJECTION: shutting down...");
  console.log(err.name, err.message);

  server.close(() => process.exit(1));
});
