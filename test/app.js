import * as chai from 'chai';
// import chaiHttp from 'chai-http';
import chaiHttp from 'chai-http/index.js';
import server from '../app.mjs';

chai.use(chaiHttp);

// const { expect } = chai;

// describe('database', () => {
//     describe('GET /get/all', () => {
//         it('should return 200 status and the correct data', async () => {
//             const res = await chai.request(server).get("/get/all");
//             // expect(res).to.have.status(200);

//         });
//     });
// });

describe('app', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting index page', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('database', () => {
    describe('GET /get/all', () => {
        it('Testing that database returns 200 status', (done) => {
            chai.request.execute(server)
                .get("/get/all")
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');

                    done();
                });
        });
    });
});
