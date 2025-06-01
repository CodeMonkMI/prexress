import config from "config";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbURl = config.get<string>("database_url");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/modules/*.schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbURl,
  },
});
