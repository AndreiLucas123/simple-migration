import { resolve } from 'path';
import fs from 'fs';
import mysql from 'mysql2';
import {
  createMigrationsTable,
  endPool,
  execMigration,
  getMigrations,
  tableExists,
} from './db-operations';

export interface ConnectionObject {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface SQLFile {
  num: number;
  content?: string;
  name: string;
  fileName: string;
}

function sortSQLFiles(a: SQLFile, b: SQLFile) {
  if (a.num < b.num) return -1;
  if (a.num > b.num) return 1;
  throw new Error(`${a.name} and ${b.name} has the same number`);
}

export default async function migrateLatest(
  conn: ConnectionObject,
  migrationPath: string = 'migrations'
) {
  // Get the migrations folder
  const migrationsFolder = resolve(process.cwd(), migrationPath);

  //
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
        name: f.substring(index + 1, f.length - 4),
        fileName: f,
      };
    })
    .sort(sortSQLFiles);

  //
  // Makes the db operations
  const pool = mysql.createPool(conn);

  try {
    if (!(await tableExists(pool, 'migrations'))) {
      await createMigrationsTable(pool);
    }

    const migrationsFromDB = await getMigrations(pool);

    //
    // Check if the migration is corrupted
    // That means, if the migrations on db is the same with the files
    if (sqlFiles.length < migrationsFromDB.length) {
      throw new Error('Migration files is corrupted');
    }

    for (let i = 0; i < migrationsFromDB.length; i++) {
      if (migrationsFromDB[i].num !== sqlFiles[i].num) {
        throw new Error('Migration files is corrupted');
      }
      if (migrationsFromDB[i].name !== sqlFiles[i].name) {
        throw new Error('Migration files is corrupted');
      }
    }

    //
    // Get every new migration that will be executed
    const sqlFilesToExecute: SQLFile[] = [];

    for (let i = migrationsFromDB.length; i < sqlFiles.length; i++) {
      sqlFilesToExecute.push(sqlFiles[i]);
    }

    sqlFilesToExecute.forEach((sqlFile) => {
      sqlFile.content = fs
        .readFileSync(resolve(migrationsFolder, sqlFile.fileName))
        .toString();
    });

    //
    // Exec each migration
    for (let i = 0; i < sqlFilesToExecute.length; i++) {
      await execMigration(pool, sqlFilesToExecute[i]);
    }

    if (sqlFilesToExecute.length) {
      console.log(
        `\x1b[32mSuccessfully executed ${sqlFilesToExecute.length} migrations\x1b[0m`
      );
    } else {
      console.log(`\x1b[32mNo migration to execute\x1b[0m`);
    }
  } finally {
    // End the pool, if get some error ignores it
    try {
      endPool(pool);
    } catch (error) {}
  }
}
