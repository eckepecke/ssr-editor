process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const auth = require('../models/auth.js');

let usersCollection;
let db;

beforeAll(async () => {
    const res = await database.getDb();

    usersCollection = res.collection;
    db = res.db;

    await usersCollection.deleteMany({});
}); 

afterAll(async () => {
    await db.client.close();
    console.log("closing server 1");

    await server.close();
});

test('Initially no user should be logged in', async () => {
    const user = auth.getCurrentUser();

    expect(user).toBe(null);
});

test('Posting correct body should result in 201 response', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            email: "test@email.com",
            password: "password"
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('message', 'User successfully registered.');
}, 30000);

test('Posting only password should return 401', async () => {
    const res = await request(server)
        .post('/auth/register')
        .send({
            password: "password"
        });

    expect(res.statusCode).toBe(401);
    expect(res.body.errors).toHaveProperty('detail', 'Email or password missing in request');
}, 30000);