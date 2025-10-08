import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";
const envFile =
  NODE_ENV === "production"
    ? ".env.production"
    : NODE_ENV === "test"
    ? ".env.test"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const envSchema = z.object({
  PORT: z.coerce.number().min(1).default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;
