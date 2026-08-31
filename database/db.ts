import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const queryClient = postgres(databaseUrl, {
  max: 10,
  idle_timeout: 30,
});

export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
  schema,
});

export { schema };
export type DbType = PostgresJsDatabase<typeof schema>;
