import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Dummy db connection if DATABASE_URL is not set, to allow build to pass.
// In a real backend scenario we'd throw, but for this local-first app we just need the exports.
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db" 
});

export const db = drizzle(pool, { schema });
