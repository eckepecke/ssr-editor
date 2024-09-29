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

describe('posts', () => {
    describe('GET /post', () => {
        it('200 HAPPY PATH getting post index page', (done) => {
            chai.request.execute(server)
                .get("/post")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

