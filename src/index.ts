export interface ConnectionObject {
  host: string;
  user: string;
  password: string;
  database: string;
}

console.log('NODE_ENV', process.env.NODE_ENV);

export default function migrateLatest(conn: ConnectionObject) {}
