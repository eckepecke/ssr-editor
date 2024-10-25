process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const auth = require('../models/auth.js');

let usersCollection;
let db;
const email = "auth@test.com"

beforeAll(async () => {
    const res = await database.getDb();

    usersCollection = res.collection;
    db = res.db;

    await usersCollection.deleteMany({});
}); 

afterAll(async () => {
    await db.client.close();
    await server.close();
});

test('Initially no user should be logged in', async () => {
    const user = auth.getCurrentUser();
    const token = auth.getCurrentToken();

    expect(user).toBe(null);
    expect(token).toBe(null);

});

test('Posting correct body should result in 201 response', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            email: email,
            password: "password"
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('message', 'User successfully registered.');
});

test('Posting only password should return 401', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            password: "password"
        });

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty('detail', 'Email or password missing in request');
});

test('Posting only email should return 401', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            email: email
        });

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty('detail', 'Email or password missing in request');
});

test('Logging in with incorrect password should not succeed', async () => {
    const res = await request(server)
        .post('/auth/login')
        .send({
            email: email,
            password: "fail"
        });

    const user = await auth.getCurrentUser();
    const token = await auth.getCurrentToken();

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty('detail', 'Password is incorrect.');
    expect(user).toBe(null);
    expect(token).toBe(null);
});

test('Logging in with incorrect user should not succeed', async () => {
    const res = await request(server)
        .post('/auth/login')
        .send({
            email: "fail@email.com",
            password: "password"
        });

    const user = await auth.getCurrentUser();
    const token = await auth.getCurrentToken();

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty('detail', 'User with provided email not found.');
    expect(user).toBe(null);
    expect(token).toBe(null);
});

test('Logging in with correct credentials should succeed', async () => {
    const res = await request(server)
        .post('/auth/login')
        .send({
            email: email,
            password: "password"
        });

    const user = await auth.getCurrentUser();
    const token = await auth.getCurrentToken();

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('message', 'User logged in');
    expect(user).toBe(email);
    expect(token).not.toBe(null);
});
