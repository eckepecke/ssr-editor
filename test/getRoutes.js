process.env.NODE_ENV = 'test';
const request = require('supertest');
const { app, server } = require('../app.js');
const database = require('../db/database.js');
const docs = require('../models/docs.js');


let usersCollection;
let db;

beforeAll(async () => {
    const res = await database.getDb();

    usersCollection = res.collection;
    db = res.db;

    await usersCollection.deleteMany({});

    await request(server)
    .post('/auth/register')
    .send({
        email: "test@email.com",
        password: "password"
    });
});

afterAll(async () => {
    await db.client.close();
    await server.close();
});

test('Initially /all should return no docs', async () => {
    const res = await request(server).get('/get/all');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data", []);
});

// test('Before login get/add should return 500', async () => {
//         const res = await request(server).get('/get/add');
    
//         expect(res.statusCode).toBe(500);
//     });

//    test('When doc exist get/add should return 200 and lastId property', async () => {
//             await request(server)
//             .post('/auth/login')
//             .send({
//                 email: "test@email.com",
//                 password: "fail"
//             });
            
//             const res = await request(server).get('/get/add');
        
//             expect(res.statusCode).toBe(200);
//             expect(res.body).toHaveProperty("lastId", 0);
        
//         });