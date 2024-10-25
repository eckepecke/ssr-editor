process.env.NODE_ENV = 'test';
const database = require('../db/database.js');
let res;

beforeAll(async () => {
    res = await database.getDb();
});


test('db should return db, client, and collection', async () => {
    expect(res.db).toBeDefined();
    expect(res.client).toBeDefined();
    expect(res.collection).toBeDefined();
});

test('db should return the expected collection name', async () => {
    const expectedCollectionName = 'users';
    expect(res.collection.collectionName).toBe(expectedCollectionName);
});