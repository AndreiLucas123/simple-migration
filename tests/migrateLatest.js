const migrateLatest = require('../dist/index').default;
require('dotenv').config();

describe('executing migrateLatest', () => {
  it('should be executing', async () => {
    await migrateLatest(
      {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      'tests/migrations'
    );
  });
});
