
import * as chaiModule from "chai";
import chaiHttp from "chai-http/index.js";
import server from "../app.mjs";

const chai = chaiModule.use(chaiHttp);
chai.should();

import database from "../db/database.mjs";
const collectionName = "test_docs";

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
//             chai.request.execute(server)
//                 .get("/get/all")
//                 .end((err, res) => {
//                     res.should.have.status(200);

//                     done();
//                 });
//         });
//     });
// });