import pg, { QueryResultRow } from "pg";
import { config } from "./config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string, 
    params: unknown[] = [],
) {
  return pool.query<T>(text, params);
}