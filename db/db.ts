import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  adminResultsInputTable,
  profilesTable,
  posthogCompletedAnalysisView,
  vapiCompletedAnalysisView 
} from "./schema";

// Create a new connection to the database
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(connectionString);
export const db = drizzle(client, {
  schema: {
    profilesTable,
    adminResultsInputTable,
    posthogCompletedAnalysisView,
    vapiCompletedAnalysisView,
  },
});
