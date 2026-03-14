import dotenv from "dotenv";

dotenv.config();

const mongoUri =
  process.env.MONGODB_URI ??
  process.env.MONGO_URI ??
  process.env.MONGO_URL ??
  process.env.MONGO_PRIVATE_URL ??
  process.env.MONGO_PUBLIC_URL ??
  process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET ?? process.env.JWT_KEY;
const rawClientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";
const clientUrls = rawClientUrl
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

if (!mongoUri) {
  throw new Error(
    "Missing required environment variable: MONGODB_URI (or MONGO_URI / MONGO_URL / DATABASE_URL)"
  );
}

if (!jwtSecret) {
  throw new Error("Missing required environment variable: JWT_SECRET (or JWT_KEY)");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri,
  jwtSecret,
  clientUrls
};
