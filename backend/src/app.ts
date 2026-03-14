import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";
import careerRoutes from "./routes/careerRoutes";
import trialRoutes from "./routes/trialRoutes";
import resultRoutes from "./routes/resultRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "tac-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/trials", trialRoutes);
app.use("/api/results", resultRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
