const request = require('supertest');
const { app, server } = require('../app.js'); // Import both app and server

afterAll(async () => {
    await server.close(); // Close the server after tests
});

test('should return 200 and an object', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
});