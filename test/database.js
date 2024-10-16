// I would like a separate test file for database code here
// When running the code below in this file I get the error:
// TypeError: Cannot read properties of undefined (reading 'execute')
// If I run the same code in app.js all goes well

// import { expect, use } from 'chai'
// import chaiHttp from 'chai-http/index.js'
// import server from '../app.mjs';

// const chai = use(chaiHttp)

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
// })
