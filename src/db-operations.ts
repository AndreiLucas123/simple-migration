import mysql from 'mysql2';
import { SQLFile } from '.';

let isoDate = new Date().toISOString();
isoDate = isoDate.substring(0, isoDate.length - 1)

export function tableExists(pool: mysql.Pool, tableName: string) {
  return new Promise<boolean>((res) => {
    const query = `SELECT 1 FROM ${tableName} LIMIT 1;`;
    pool.execute(query, (err) => {
      if (err) {
        res(false);
      } else {
        res(true);
      }
    });
  });
}

function execQuery(pool: mysql.Pool, sql: string) {
  return new Promise<any>((res, rej) => {
    pool.execute(sql, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

export function createMigrationsTable(pool: mysql.Pool) {
  const query = `
CREATE TABLE migrations (
num INT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
executed DATETIME NOT NULL
);`;
  return execQuery(pool, query);
}

export function endPool(pool: mysql.Pool) {
  return new Promise<any>((res, rej) => {
    pool.end((err) => {
      err ? rej(err) : res(true);
    });
  });
}

export function getMigrations(pool: mysql.Pool) {
  const query = `SELECT num, name FROM migrations`;
  return execQuery(pool, query);
}

export async function execMigration(pool: mysql.Pool, sqlFile: SQLFile) {
  await execQuery(pool, sqlFile.content!);
  await execQuery(
    pool,
    `INSERT INTO migrations VALUES (${sqlFile.num}, '${sqlFile.name}', '${isoDate}')`
  );
}
