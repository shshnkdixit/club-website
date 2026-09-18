import fs from 'fs';
import path from 'path';
import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';

let pgPool: Pool | null = null;
let pgliteInstance: PGlite | null = null;
let isInitialized = false;

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

/**
 * Returns true if connected to a remote PostgreSQL (e.g. Neon), false if using local file.db
 */
export function isRemotePostgres(): boolean {
  return Boolean(DATABASE_URL);
}

/**
 * Get or initialize the database instance
 */
export async function getDb() {
  if (DATABASE_URL) {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: DATABASE_URL,
        ssl: DATABASE_URL.includes('neon.tech') || DATABASE_URL.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : undefined,
      });
    }
    return { type: 'postgres' as const, client: pgPool };
  }

  if (!pgliteInstance) {
    const dataDir = path.join(process.cwd(), 'data', 'file.db');
    if (!fs.existsSync(path.dirname(dataDir))) {
      fs.mkdirSync(path.dirname(dataDir), { recursive: true });
    }
    pgliteInstance = new PGlite(dataDir);
  }

  return { type: 'pglite' as const, client: pgliteInstance };
}

/**
 * Execute a SQL query with parameters
 */
export async function query<T = any>(sqlText: string, params: any[] = []): Promise<{ rows: T[] }> {
  await ensureInitialized();
  const db = await getDb();

  if (db.type === 'postgres') {
    const res = await db.client.query(sqlText, params);
    return { rows: res.rows as T[] };
  } else {
    // PGlite query
    const res = await db.client.query(sqlText, params);
    return { rows: res.rows as T[] };
  }
}

/**
 * Execute raw SQL (e.g. DDL / migrations)
 */
export async function exec(sqlText: string): Promise<void> {
  const db = await getDb();
  if (db.type === 'postgres') {
    await db.client.query(sqlText);
  } else {
    await db.client.exec(sqlText);
  }
}

/**
 * Automatically initializes tables from schema.sql on first startup if needed
 */
export async function ensureInitialized(): Promise<void> {
  if (isInitialized) return;

  try {
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await exec(schemaSql);
    }
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  }
}

export default {
  query,
  exec,
  ensureInitialized,
  isRemotePostgres,
};
