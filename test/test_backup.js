
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

import {use} from 'chai';
import chaiHttp from 'chai-http/index.js';
import server from '../app.mjs';
import HTMLParser from 'node-html-parser';

const chai = use(chaiHttp);
chai.should();
/////////////////////////////////////////////



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
        it('Testing that database returns 200 status', (done) => {
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


        it('Testing that id is a string', (done) => {
            chai.request.execute(server)
                .get("/get/add")
                .end((err, res) => {
                    res.body.lastId.should.be.a('string');
                    done();
                });
        });

        // it('Testing that data has lastId', (done) => {
        //     chai.request.execute(server)
        //         .get("/get/add")
        //         .end((err, res) => {
        //             res.body.data.should.have.property('lastId');
        //             done();
        //         });
        // });
    });
});
