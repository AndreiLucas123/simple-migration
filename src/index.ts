import { resolve } from 'path';
import fs from 'fs';

export interface ConnectionObject {
  host: string;
  user: string;
  password: string;
  database: string;
}

export default async function migrateLatest(
  conn: ConnectionObject,
  migrationPath: string = 'migrations'
) {
  // Get the migrations folder
  const migrationsFolder = resolve(process.cwd(), migrationPath);

  // Get every-file in migrations folder
  const files = fs
    .readdirSync(migrationsFolder)
    .filter((f) => /\d+-\w+\.sql/.test(f));

  console.log(files);
}
