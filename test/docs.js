process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const auth = require('../models/auth.js');

let docsTestCollection;
let docsDb;
const testUserDocs = "docs@test.com"
const collaborator = "collab@test.com"
const id = 1;
const testDoc = {
    id: id,
    title: "test",
    content: "test content",
    allowed_users: [testUserDocs],
    isCode: false,
};

beforeEach(async () => {
    const res = await database.getDb();

    docsTestCollection = res.collection;
    docsDb = res.db;

    await docsTestCollection.deleteMany({});

    await request(server)
    .post('/auth/register')
    .send({
        email: testUserDocs,
        password: "password"
    });

    const loginResponse = await request(server)
    .post('/auth/login')
    .send({
        email: testUserDocs,
        password: "password"
    });
});

afterEach(async () => {
    await docsDb.client.close();
    await server.close();
});

test('Initially getAll should return empty array', async () => {
    const checkUser = await docsTestCollection.findOne({ email: testUserDocs });
    const user = await auth.getCurrentUser();
    const res = await request(server).get('/get/all');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data).toHaveLength(0);
});

test('After adding doc getAll should return the added doc', async () => {
    const res = await request(server)
    .post('/post/add')
    .send(testDoc);

    expect(res.statusCode).toBe(201);

    const res2 = await request(server).get('/get/all');
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toBeInstanceOf(Object);
    expect(res2.body.data).toBeInstanceOf(Array);
    expect(res2.body.data).toHaveLength(1);
    expect(res2.body).toBeInstanceOf(Object);
    expect(res2.body.data[0]).toHaveProperty("id", id);
    expect(res2.body.data[0]).toHaveProperty("title", "test");
    expect(res2.body.data[0]).toHaveProperty("content", "test content");
    expect(res2.body.data[0]).toHaveProperty("allowed_users", [testUserDocs]);
    expect(res2.body.data[0]).toHaveProperty("is_code", false);
    expect(res2.body.data[0]).toHaveProperty("created_at");
});

test('After adding doc get/:id should return doc with the given id', async () => {
    const checkUser = await docsTestCollection.findOne({ email: testUserDocs });

    await request(server)
    .post('/post/add')
    .send(testDoc);

    const res = await request(server).get(`/get/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('doc');
    expect(res.body.doc).toBeInstanceOf(Object);
    expect(res.body.doc.id).toBe(1);
    expect(res.body.doc.title).toBe("test");
    expect(res.body.doc.content).toBe("test content");
    expect(res.body.doc.allowed_users).toStrictEqual([testUserDocs]);
    expect(res.body.doc.is_code).toBe(false);
    expect(res.body.doc.created_at).toBeDefined;
});

test('After adding doc get/:id should return doc with the given id', async () => {
    const checkUser = await docsTestCollection.findOne({ email: testUserDocs });

    await request(server)
    .post('/post/add')
    .send(testDoc);

    const res = await request(server).get(`/get/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('doc');
    expect(res.body.doc).toBeInstanceOf(Object);
    expect(res.body.doc.id).toBe(1);
    expect(res.body.doc.title).toBe("test");
    expect(res.body.doc.content).toBe("test content");
    expect(res.body.doc.allowed_users).toStrictEqual([testUserDocs]);
    expect(res.body.doc.is_code).toBe(false);
    expect(res.body.doc.created_at).toBeDefined;
});
