import { resolve } from 'path';
import fs from 'fs';
import mysql from 'mysql2';
import { createMigrationsTable, endPool, tableExists } from './db-operations';

export interface ConnectionObject {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface SQLFile {
  num: number;
  content?: string;
  fileName: string;
}

function sortSQLFiles(a: SQLFile, b: SQLFile) {
  if (a.num < b.num) return -1;
  if (a.num > b.num) return 1;
  throw new Error(`${a.fileName} and ${b.fileName} has the same number`);
}

export default async function migrateLatest(
  conn: ConnectionObject,
  migrationPath: string = 'migrations'
) {
  // Get the migrations folder
  const migrationsFolder = resolve(process.cwd(), migrationPath);

  // Get every-file in migrations folder
  // Filter, convert to SQLFile objects and sort
  const sqlFiles = fs
    .readdirSync(migrationsFolder)
    .filter((f) => /\d+-(\w|-)+\.sql/.test(f))
    .map<SQLFile>((f) => {
      const index = f.indexOf('-');
      const num = Number.parseInt(f.substring(0, index));
      return {
        num,
        fileName: f,
      };
    })
    .sort(sortSQLFiles);

  // Makes the db operations
  const pool = mysql.createPool(conn);

  if (!(await tableExists(pool, 'migrations'))) {
    await createMigrationsTable(pool);
  }

  endPool(pool);

  console.log(sqlFiles);
}
