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

const normalizeOrigin = (value: string): string => {
  const cleanedValue = value
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\/+$/, "");

  try {
    return new URL(cleanedValue).origin;
  } catch {
    return cleanedValue;
  }
};

const isAllowedOrigin = (origin: string): boolean => {
  const normalizedOrigin = normalizeOrigin(origin);
  try {
    const originUrl = new URL(normalizedOrigin);
    // Fallback for Vercel preview and production deployments.
    if (originUrl.protocol === "https:" && originUrl.hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch {
    // no-op
  }

  return env.clientUrls.some((allowed) => {
    const normalizedAllowed = normalizeOrigin(allowed);

    if (normalizedAllowed === normalizedOrigin) {
      return true;
    }

    // Supports wildcard entries like "https://*.vercel.app"
    if (normalizedAllowed.includes("*.")) {
      try {
        const originUrl = new URL(normalizedOrigin);
        const wildcardBase = normalizedAllowed.replace("*.", "");
        const allowedUrl = new URL(wildcardBase);
        return (
          originUrl.protocol === allowedUrl.protocol &&
          originUrl.hostname.endsWith(allowedUrl.hostname)
        );
      } catch {
        return false;
      }
    }

    return false;
  });
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
