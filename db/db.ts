import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable, sessionPhaseAnalysisTable } from "./schema";

config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  sessionPhaseAnalysis: sessionPhaseAnalysisTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
