import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/v1/auth.routes.js";
import tradeRoutes from "./src/routes/v1/trade.routes.js";
import { errorHandler } from "./src/middleware/error.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";
import { swaggerSpec } from "./src/swagger/swagger.js";
import logger from "./src/utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(mongoSanitize());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/trades", tradeRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api/docs`);
  });
};

start();
