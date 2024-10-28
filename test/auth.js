process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const auth = require('../models/auth.js');

let usersCollection;
let db;
const defaultEmail = "default@test.com"
const newEmail = "auth@test.com"


beforeEach(async () => {
    const res = await database.getDb();

    usersCollection = res.collection;
    db = res.db;

    await usersCollection.deleteMany({});

    await request(server)
    .post('/auth/register')
    .send({
        email: defaultEmail,
        password: "password"
    });
}); 

afterEach(async () => {
    await db.client.close();
    await server.close();
});


test('Posting correct body should result in 201 response', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            email: newEmail,
            password: "password"
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('message', 'User successfully registered.');
});

test('Registering twice should fail.', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            email: newEmail,
            password: "password"
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('message', 'User successfully registered.');

    const res2 = await request(server)
    .post('/auth/register')
    .send({
        email: newEmail,
        password: "password"
    });

    expect(res2.statusCode).toBe(409);
    expect(res2.body.errors).toHaveProperty('detail', 'A user with this email address already exists.');
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
            email: newEmail
        });

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty('detail', 'Email or password missing in request');
});

test('Logging in with incorrect password should not succeed', async () => {
    auth.setCurrentToken = null;
    auth.setCurrentUser = null;

    const res = await request(server)
        .post('/auth/login')
        .send({
            email: defaultEmail,
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
            email: defaultEmail,
            password: "password"
        });

    const user = await auth.getCurrentUser();
    const token = await auth.getCurrentToken();

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('message', 'User logged in');
    expect(user).toBe(defaultEmail);
    expect(token).not.toBe(null);
});
