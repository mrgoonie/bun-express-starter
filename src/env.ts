import z from "zod";
import dotenv from "dotenv";
import { toInt } from "diginext-utils/dist/object";

dotenv.config();

export const envSchema = z.object({
  PORT: z.number(),
  NODE_ENV: z.string(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
});
export type Env = z.infer<typeof envSchema>;

export const env: Env = {
  PORT: toInt(process.env["PORT"]) || 3000,
  NODE_ENV: process.env["NODE_ENV"] || "development",
  REDIS_HOST: process.env["REDIS_HOST"],
  REDIS_PORT: process.env["REDIS_PORT"],
  REDIS_USERNAME: process.env["REDIS_USERNAME"],
  REDIS_PASSWORD: process.env["REDIS_PASSWORD"],
};
