// import * as chai from 'chai'; // Import chai as an object
// import chaiHttp from 'chai-http'; // Import chai-http
// import server from '../app.mjs'; // Adjust the path as necessary
// import database from '../db/database.mjs'; // Adjust the path as necessary
// const collectionName = "users"


// chai.use(chaiHttp); // Register chai-http with chai
// chai.should(); // Enable should assertions

// describe('database_2', () => {
//     before(async () => {
//         const db = await database.getDb();
//         console.log(db.client);

//         db.db.listCollections({ name: collectionName })
//             .next()
//             .then(async function(info) {
//                 if (info) {
//                     await db.collection.drop();
//                 }
//             })
//             .catch(function(err) {
//                 console.error(err);
//             })
//             .finally(async function() {
//                 await db.client.close();
//             });
//     });

//     describe('GET /get/all', () => {
//         it('200 HAPPY PATH getting form', (done) => {
//             chai.request(server) // Correct usage of chai.request
//                 .get("/get/all")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     done();
//                 });
//         });
//     });
// });