// // import { use, expect } from 'chai'
// // import chaiHttp from 'chai-http/index.js'
// // const chai = use(chaiHttp)

// // chai.request()



// import { expect, use } from 'chai'
// import chaiHttp from 'chai-http/index.js'
// import server from '../app.mjs';

// const chai = use(chaiHttp)

// describe('app', () => {
//     describe('GET /', () => {
//         it('200 HAPPY PATH getting index page', (done) => {
//             // chai.request(server)
//             chai.request.execute(server)

//                 .get("/")
//                 .end((err, res) => {
//                     // res.should.have.status(200);
//                     chai.expect(res).to.have.status(200)

//                     done();
//                 });
//         });
//     });
// });

// // describe('Integration test for job creation', () => {
// //     it('should be able to create a job', (done) => {
// //         chai.request.execute(app)
// //             .post('/job')
// //             .end((err, res) => {
// //                 chai.expect(res).to.have.status(200)
// //             })
// //     })
// // })

// describe('database', () => {
//     describe('GET /get/all', () => {
//         it('should return 200 status', (done) => {
//             chai.request.execute(server)
//                 .get("/get/all")
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(200)
//                     done();
//                 });
//         });

//         it('should return an object as the body', (done) => {
//             chai.request.execute(server)
//                 .get("/get/all")
//                 .end((err, res) => {
//                     chai.expect(res).to.be.a('object');
//                     done();
//                 });
//         });
//     });

    //     it('should have data property', (done) => {
    //         chai.request.execute(server)
    //             .get("/get/all")
    //             .end((err, res) => {
    //                 chai.expect(res).body.to.have.property('data');
    //                 done();
    //             });
    //     });

    //     it('data should be an array', (done) => {
    //         chai.request.execute(server)
    //             .get("/get/all")
    //             .end((err, res) => {
    //                 chai.expect(res).to.be.a('array');
    //                 done();
    //             });
    //     });
    // })


    // describe('GET /get/add', () => {
    //     it('Testing that database returns 200 status', (done) => {
    //         chai.request.execute(server)
    //             .get("/get/add")
    //             .end((err, res) => {
    //                 chai.expect(res).to.have.status(200)
    //                 chai.expect(res).to.be.a('object');

    //                 res.body.should.be.a('object');
    //                 res.body.should.have.property('data');
    //                 res.body.data.should.be.a('array');
    //                 done();
    //             });
    //     });
    // })

