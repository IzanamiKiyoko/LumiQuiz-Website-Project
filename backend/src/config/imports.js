// Gom tất cả import thường dùng vào đây
import express from "express";
import cors from "cors";

import { PORT } from "./dotenv.js";
import connectDB from "./db.js";
import { logger } from "./logger.js";

export {
  express,
  cors,
  PORT,
  connectDB,
  logger,
};
