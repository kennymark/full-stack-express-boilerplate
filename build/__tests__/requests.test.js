"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
var supertest_1 = __importDefault(require("supertest"));
var app_1 = __importDefault(require("../app"));
describe('Test routes', function () {
    test('home route return a 2000', function () {
        supertest_1.default(app_1.default)
            .get('/')
            .then(function (response) {
            expect(response.status).toBe(200);
        });
    });
    test('login route returns a 2000', function () {
        supertest_1.default(app_1.default)
            .get('/user/login')
            .then(function (response) {
            expect(response.status).toBe(200);
        });
    });
    test('register route returns a 2000', function () {
        supertest_1.default(app_1.default)
            .get('/user/register')
            .then(function (response) {
            expect(response.status).toBe(200);
        });
    });
    test('contact route returns a 2000', function () {
        supertest_1.default(app_1.default)
            .get('/contact')
            .then(function (response) {
            expect(response.status).toBe(200);
        });
    });
    test('about page returns a 2000', function () {
        supertest_1.default(app_1.default)
            .get('/about')
            .then(function (response) {
            expect(response.status).toBe(200);
        });
    });
    test('pricing page returns a 2000', function () {
        supertest_1.default(app_1.default)
            .get('/pricing')
            .then(function (response) {
            expect(response.status).toBe(200);
        });
    });
    test('incorrect route', function () {
        supertest_1.default(app_1.default)
            .get('/4084084ng')
            .then(function (response) {
            expect(response.status).toBe(404);
        });
    });
    test('redirect user after login', function () {
        supertest_1.default(app_1.default)
            .post('/user/login')
            .send({
            email: 'test@test.com',
            password: 'test1'
        })
            .set('Accept', 'application/json')
            .then(function (res) {
            expect(res.redirect).toBe(true);
        });
    });
    test('goes to user profile after login', function () {
        supertest_1.default(app_1.default)
            .post('/user/login')
            .send({
            email: 'test@test.com',
            password: 'test'
        })
            .set('Accept', 'application/json')
            .then(function (res) {
            expect(res.redirect).toBe(true);
            expect(res.status).toBe(302);
        });
    });
    test('does not to user profile after login', function () {
        supertest_1.default(app_1.default)
            .post('/user/login')
            .send({
            email: 'test@test.com',
            password: 'test'
        })
            .set('Accept', 'application/json')
            .then(function (res) {
            expect(res.redirect).toBe(true);
            expect(res.status).toBe(302);
        });
    });
    test('logs user out sucessfully', function () {
        supertest_1.default(app_1.default)
            .get('/user/logout')
            .then(function (res) {
            expect(res.redirect).toBe(true);
        });
    });
});
