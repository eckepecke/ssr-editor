process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');

afterAll(async () => {
    console.log("closing server 1");
    await server.close();
});

test('testing that index reote returns instructions', async () => {
    const res = await request(server).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('routes');
});