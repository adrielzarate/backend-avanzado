'use strict';

require('dotenv').config();

const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const jwt_secret = process.env.JWT_SECRET;

describe('POST API authentication', function() {
    it('return JWT', function(done) {
        request(app)
            .post('/api/authenticate/')
            .field('email', email)
            .field('password', password)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET return 401 in API without JWT', function() {
    it('401 without JWT', function(done) {
        request(app)
            .get('/api/anuncios/')
            .expect(401, done);
    });
});

describe('GET return json in API with JWT', function() {
    let apiKey = null;
    before(function(done) {
        jwt.sign({ email: email }, jwt_secret, {
            expiresIn: 1600
        }, (err, token) => {
            if (err) {
                console.log(err);
                return;
            }
            apiKey = token;
        });
        done();
    });
    it('json with JWT', function(done) {
        request(app)
            .get('/api/anuncios/?token=' + apiKey)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET return 401 with timed out JWT', function() {
    let apiKey = null;
    before(function(done) {
        jwt.sign({ email: email }, jwt_secret, {
            expiresIn: 1
        }, (err, token) => {
            if (err) {
                console.log(err);
                return;
            }
            apiKey = token;
        });
        done();
    });
    it('401 with timed out JWT', function(done) {
        setTimeout(function() {
            request(app)
                .get('/api/anuncios/?token=' + apiKey)
                .expect('Content-Type', /json/)
                .expect(401, done);
        }, 1900);
    });
});