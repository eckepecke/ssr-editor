process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const docs = require('../models/docs.js');
const auth = require('../models/auth.js');


let usersCollection;
let db;
const testUser = "gets@test.com"

beforeAll(async () => {
    const res = await database.getDb();

    usersCollection = res.collection;
    db = res.db;

    await usersCollection.deleteMany({});

    await request(server)
    .post('/auth/register')
    .send({
        email: testUser,
        password: "password"
    });

    await request(server)
    .post('/auth/login')
    .send({
        email: testUser,
        password: "password"
    });
});

afterAll(async () => {
    await db.client.close();
    await server.close();
});

test('testing that /get route returns instructions', async () => {
    const res = await request(server).get('/get');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('routes');
});

test('Initially /get/all should return no docs', async () => {
    const res = await request(server).get('/get/all');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data", []);
});

test('With no docs /get/add should return 200 and lastID should be 0', async () => {
        const res = await request(server).get('/get/add');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("lastId", 0);
    });

   test('When doc exist get/add should return 200 and lastId property', async () => {
    const testBody = {
        id: 1,
        title: "test",
        content: "test content",
        allowed_users: [testUser],
        isCode: false,
    };

        await request(server)
        .post('/post/add')
        .send(testBody);
        
        const res = await request(server).get('/get/add');
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("lastId", 1);
    });

    test('With doc added should find it with get/:id', async () => {
        const res = await request(server).get('/get/1');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.doc.id).toBe(1);
        expect(res.body.doc.title).toBe("test");
        expect(res.body.doc.content).toBe("test content");
        expect(res.body.doc.allowed_users).toStrictEqual([testUser]);
        expect(res.body.doc.is_code).toBe(false);
        expect(res.body.doc.created_at).toBeDefined;
    });

    test('With no user logged in get/:id should return 401', async () => {
        auth.setCurrentUser(null);
        auth.setCurrentToken(null);
        const res = await request(server).get('/get/1');

        expect(res.statusCode).toBe(401);
        expect(res.body.errors).toHaveProperty("detail", "No token provided in request headers");
    });

    test('With no user logged in /get/add should return 401', async () => {
        auth.setCurrentUser(null);
        auth.setCurrentToken(null);

        const res = await request(server).get('/get/add');

        expect(res.statusCode).toBe(401);
        expect(res.body.errors).toHaveProperty("detail", "No token provided in request headers");
    });

    test('With no user logged in /get/all should return 401', async () => {
        auth.setCurrentUser(null);
        auth.setCurrentToken(null);

        const res = await request(server).get('/get/all');

        expect(res.statusCode).toBe(401);
        expect(res.body.errors).toHaveProperty("detail", "No token provided in request headers");
    });