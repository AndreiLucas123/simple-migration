#!/usr/bin/env node

const migrateLatest = require('../dist/migrate-latest').migrateLatest;
const dotenv = require('dotenv');

async function execute() {
  try {
    let migrationDir;
    if (process.argv[2]) {
      migrationDir = process.argv[2];
    }

    dotenv.config();

    await migrateLatest(
      {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      migrationDir
    );
  } catch (error) {
    console.error(error);
  }
}

execute();
