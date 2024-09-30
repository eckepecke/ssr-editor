process.env.NODE_ENV = 'test';

// Require the dev-dependencies
import {use} from 'chai';
import chaiHttp from 'chai-http/index.js';
import server from '../app.mjs';
import HTMLParser from 'node-html-parser';

const chai = use(chaiHttp);
chai.should();

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
