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

    console.log("LoginResponse:", loginResponse.body);



});

afterEach(async () => {
    await docsDb.client.close();
    await server.close();
});

test('Initially getAll should return empty array', async () => {
    const checkUser = await docsTestCollection.findOne({ email: testUserDocs });
    // console.log("User check 2:", checkUser);


    const user = await auth.getCurrentUser();

    // console.log(user);

    const res = await request(server).get('/get/all');
    // console.log("res after get/all ",res.body)

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data).toHaveLength(0);
});

test('After adding doc getAll should return the added doc', async () => {

    console.log("Current User:", auth.getCurrentUser());

    const res = await request(server)
    .post('/post/add')
    .send(testDoc);

    expect(res.statusCode).toBe(201);
    console.log("res after posting new doc:", res.body);


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
    console.log("User check 1:", checkUser);

    await request(server)
    .post('/post/add')
    .send(testDoc);

    const res = await request(server).get(`/get/${id}`);
    console.log(res.body);

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

// test('Ensuring update works.', async () => {

//     const updateBody = {
//         id: id,
//         title: "updated",
//         content: "updated content",
//     };

//     const res1 = await request(server)
//     .post(`/post/update/doc`)
//     .send(updateBody);

//     const res2 = await request(server).get(`/get/${id}`);

//     expect(res1.statusCode).toBe(201);
//     expect(res1.body).toHaveProperty("success", true);

//     expect(res2.statusCode).toBe(200);
//     expect(res2.body).toHaveProperty('doc');
//     expect(res2.body.doc).toBeInstanceOf(Object);
//     expect(res2.body.doc.id).toBe(id);
//     expect(res2.body.doc.title).toBe("updated");
//     expect(res2.body.doc.content).toBe("updated content");
//     expect(res2.body.doc.allowed_users).toStrictEqual([testUserDocs]);
//     expect(res2.body.doc.is_code).toBe(false);
//     expect(res2.body.doc.created_at).toBeDefined;
// });

// test('Ensuring that new user can access doc after being added', async () => {

//     const updateBody = {
//         id: id,
//         newUser: collaborator,
//     };

//     const res1 = await request(server)
//     .post(`/post/update/access`)
//     .send(updateBody);

//     const res2 = await request(server).get(`/get/${id}`);

//     await request(server)
//     .post('/auth/login')
//     .send({
//         email: collaborator,
//         password: "password"
//     });

//     const res3 = await request(server).get(`/get/all`);

//     expect(res1.statusCode).toBe(201);
//     expect(res1.body).toHaveProperty("success", true);
//     console.log(res2.body)
//     console.log(res2.body.doc)


//     expect(res2.body.doc.allowed_users).toStrictEqual([testUserDocs, collaborator]);

//     expect(res3.statusCode).toBe(200);
//     expect(res3.body).toBeInstanceOf(Object);

//     console.log(auth.getCurrentUser());
//     console.log(res3.body);
//     console.log(res3.body.data);

//     expect(res3.body.data[0].id).toBe(1);
//     expect(res3.body.data[0].title).toBe("test");
//     expect(res3.body.data[0].content).toBe("test content");
//     expect(res3.body.data[0].allowed_users).toStrictEqual([testUserDocs, collaborator]);
//     expect(res3.body.data[0].is_code).toBe(false);
//     expect(res3.body.data[0].created_at).toBeDefined;
// });

// test('Ensuring that adding access also adds doc to collaborators doc array', async () => {
//     const updateBody = {
//         id: id,
//         newUser: collaborator,
//     };

//     const res1 = await request(server)
//     .post(`/post/update/access`)
//     .send(updateBody);

//     await request(server)
//     .post('/auth/login')
//     .send({
//         email: collaborator,
//         password: "password"
//     });

//     const res = await request(server).get(`/get/all`);


//     console.log(auth.getCurrentUser());
//     console.log(res.body);
//     console.log(res.data);


//     expect(res.body.data[0].id).toBe(1);
//     expect(res.body.data[0].title).toBe("test");
//     expect(res.body.data[0].content).toBe("test content");
//     expect(res.body.data[0].allowed_users).toStrictEqual([testUserDocs, collaborator]);
//     expect(res.body.data[0].is_code).toBe(false);
// });

// test('Ensuring that adding another doc appends the now doc', async () => {

//     await request(server)
//     .post('/auth/login')
//     .send({
//         email: testUserDocs,
//         password: "password"
//     });

//     const testDoc = {
//         id: 2,
//         title: "test2",
//         content: "test content2",
//         allowed_users: [testUserDocs],
//         isCode: true,
//     };

//     await request(server)
//     .post('/post/add')
//     .send(testDoc);

//     const res = await request(server).get(`/get/all`);

//     expect(res.body.data).toHaveLength(2);


//     expect(res.body.data[1].id).toBe(2);
//     expect(res.body.data[1].title).toBe("test2");
//     expect(res.body.data[1].content).toBe("test content2");
//     expect(res.body.data[1].allowed_users).toStrictEqual([testUserDocs]);
//     expect(res.body.data[1].is_code).toBe(true);


// });