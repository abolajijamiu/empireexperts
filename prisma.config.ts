import { defineConfig } from "prisma/config";
import * as fs from "fs";
import * as path from "path";

// Manually load .env so Prisma CLI picks up DATABASE_URL
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^"|"$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
