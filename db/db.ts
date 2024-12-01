import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable } from "./schema";
import { combinedLLMResults } from "./schema/combined-llm-results-schema";
import { llmBossResults } from "./schema/llm-boss-results-schema";

config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL!, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10
});

export const db = drizzle(client, { 
  schema: {
    profiles: profilesTable,
    combinedLLMResults,
    llmBossResults
  }
});
