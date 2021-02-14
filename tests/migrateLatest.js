const migrateLatest = require('../dist/index').default;

describe('executing migrateLatest', () => {
  it('should be executing', async () => {
    await migrateLatest({}, 'tests/migrations')
  });
});
