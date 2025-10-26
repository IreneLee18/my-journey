import { config } from 'dotenv';
import { defineConfig, env } from "prisma/config";

// 手動載入 .env 文件
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_DATABASE_URL"),
  },
});
