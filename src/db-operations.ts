import mysql from 'mysql2/promise';
import { SQLFile } from '.';

let isoDate = new Date().toISOString();
isoDate = isoDate.substring(0, isoDate.length - 1);

export function tableExists(pool: mysql.Pool, tableName: string) {
  const query = `SELECT 1 FROM ${tableName} LIMIT 1;`;
  try {
    pool.execute(query);
    return true;
  } catch (error) {
    return false;
  }
}

export function createMigrationsTable(pool: mysql.Pool) {
  const query = `
CREATE TABLE migrations (
num INT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
executed DATETIME NOT NULL
);`;
  return pool.execute(query);
}

export function getMigrations(pool: mysql.Pool) {
  const query = `SELECT num, name FROM migrations`;
  return pool.execute(query) as Promise<any[]>;
}

export async function execMigration(pool: mysql.Pool, sqlFile: SQLFile) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await conn.execute(sqlFile.content!);

    await conn.query(`INSERT INTO migrations VALUES (?, ?, ?)`, [
      sqlFile.num,
      sqlFile.name,
      isoDate,
    ]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    if (conn) await conn.release();
  }
}
