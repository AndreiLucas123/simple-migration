import { migrateLatest } from '.';
import dotenv from 'dotenv'

let migrationDir: string | undefined;
if (process.argv[2]) {
  migrationDir = process.argv[2];
}

dotenv.config();

migrateLatest(
  {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  migrationDir
);
