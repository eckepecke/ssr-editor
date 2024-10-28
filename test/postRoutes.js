process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const docs = require('../models/docs.js');
const auth = require('../models/auth.js');


let usersCollection;
let db;
const testUser = "posts@test.com"
const testBody = {
    id: 1,
    title: "test",
    content: "test content",
    allowed_users: [testUser],
    isCode: true,
};

const errorBody = {
    id: 5,
    title: "test",
    content: "test content",
    allowed_users: [testUser],
    isCode: true,
};

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

test('testing that /post route returns instructions', async () => {
    const res = await request(server).get('/get');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('routes');
});

test('/post/add should return 201 with correct body', async () => {
    const testBody = {
        id: 1,
        title: "test",
        content: "test content",
        allowed_users: [testUser],
        isCode: true,
    };

    const res = await request(server).post('/post/add').send(testBody);;

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
});

test('/post/update/doc should return 201 with correct body', async () => {

    const res = await request(server).post('/post/update/doc').send(testBody);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
});

test('/post/update/doc should return 404 with incorrect body', async () => {

    console.log("time for error");
    const res = await request(server).post('/post/update/doc').send(errorBody);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("success", false);
});

test('/post/update/access should return 201 with correct body', async () => {
    testBody.newUser = "test";

    console.log("time for error");
    const res = await request(server).post('/post/update/doc').send(testBody);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
});

test('/post/update/access should return 404 with incorrect body', async () => {
    errorBody.newUser = "test";

    console.log("time for error");
    const res = await request(server).post('/post/update/doc').send(errorBody);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("success", false);
});

test('With no user logged in /post/add should return 401', async () => {
    auth.setCurrentUser(null);
    auth.setCurrentToken(null);

    const res = await request(server).post('/post/add');

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty("detail", "No token provided in request headers");
});

test('With no user logged in /post/update/doc should return 401', async () => {
    auth.setCurrentUser(null);
    auth.setCurrentToken(null);

    const res = await request(server).post('/post/update/doc');

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty("detail", "No token provided in request headers");
});


test('With no user logged in /post/update/access should return 401', async () => {
    auth.setCurrentUser(null);
    auth.setCurrentToken(null);

    const res = await request(server).post('/post/update/access');

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty("detail", "No token provided in request headers");
});