import mysql from 'mysql2';

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

export function createMigrationsTable(pool: mysql.Pool) {
  return new Promise<any>((res, rej) => {
    const query = `
CREATE TABLE migrations (
  num INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  executed DATETIME NOT NULL
);`;
    pool.execute(query, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

export function endPool(pool: mysql.Pool) {
  return new Promise<any>((res, rej) => {
    pool.end((err) => {
      err ? rej(err) : res(true);
    });
  });
}
