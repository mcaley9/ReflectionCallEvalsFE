import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const clientMappings = pgTable("Client_Mappings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: text("tenant_id").notNull().unique(),
  clientName: text("client_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
}); 