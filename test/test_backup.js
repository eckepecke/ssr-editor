process.env.NODE_ENV = "test"
//////////////////////////////////////////
// this setup doesnt work at all

// import * as chai from 'chai';
// // import chaiHttp from 'chai-http';
// import chaiHttp from 'chai-http/index.js';
// import server from '../app.mjs';

// chai.use(chaiHttp);

// const { expect } = chai;
////////////////////////////////////////////////

/////////////////////////////////////////////
// This setup works with .execute but only when there is a single file in test folder

// import {use} from 'chai';
// import chaiHttp from 'chai-http/index.js';
// import server from '../app.mjs';
// import HTMLParser from 'node-html-parser';

// const chai = use(chaiHttp);
// chai.should();
/////////////////////////////////////////////

// efo test
import * as chaiModule from "chai";
import chaiHttp from "chai-http/index.js";
import server from "../app.mjs";
import database from "../db/database.mjs";
const collectionName = "documents";



const chai = chaiModule.use(chaiHttp);

chai.should();

// describe('Reports', () => {
//     describe('GET /test', () => {
//         it('200 HAPPY PATH', (done) => {
//             chai.request.execute(server)
//                 .get("/test")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.an("object");

//                     done();
//                 });
//         });
//     });
// });
////////////////////////////


describe('app', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting index page', (done) => {
            chai.request.execute(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('database', () => {
    before(async () => {
        const db = await database.getDb();
        console.log(db.client);

        db.db.listCollections({ name: collectionName })
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });

    describe('GET /get/all', () => {
        it('should return 200 status', (done) => {
            chai.request.execute(server)
                .get("/get/all")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    
        it('should return an object as the body', (done) => {
            chai.request.execute(server)
                .get("/get/all")
                .end((err, res) => {
                    res.body.should.be.a('object');
                    done();
                });
        });
    
        it('should have a "data" property', (done) => {
            chai.request.execute(server)
                .get("/get/all")
                .end((err, res) => {
                    res.body.should.have.property('data');
                    done();
                });
        });
    
        it('data should be an array', (done) => {
            chai.request.execute(server)
                .get("/get/all")
                .end((err, res) => {
                    res.body.data.should.be.a('array');
                    done();
                });
        });
    });
    

    describe('GET /get/add', () => {
        it('200 HAPPY PATH getting get/add', (done) => {
            chai.request.execute(server)
                .get("/get/add")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Testing that database returns object', (done) => {
            chai.request.execute(server)
                .get("/get/add")
                .end((err, res) => {
                    res.body.should.be.a('object');
                    done();
                });
        });


        it('Testing that result has data property', (done) => {
            chai.request.execute(server)
                .get("/get/add")
                .end((err, res) => {
                    res.body.should.have.property('lastId');
                    done();
                });
        });
    });

    // describe('POST /post/add', () => {
    //     it('Testing post/add returns 500 posting invalid data', (done) => {
    //         let doc = {
    //             title: "test",
    //             // content: "no content",
    //             // id: 1
    //         };
    //         chai.request.execute(server)
    //             .post("/post/add")
    //             .end((err, res) => {
    //                 res.should.have.status(500);
    //                 done();
    //             });
    //     });
    // });
})
