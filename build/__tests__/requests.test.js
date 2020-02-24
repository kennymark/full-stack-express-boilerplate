"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Test routes', () => {
    test('home route return a 2000', () => {
        supertest_1.default(app_1.default)
            .get('/')
            .then(response => {
            expect(response.status).toBe(200);
        });
    });
    test('login route returns a 2000', () => {
        supertest_1.default(app_1.default)
            .get('/user/login')
            .then(response => {
            expect(response.status).toBe(200);
        });
    });
    test('register route returns a 2000', () => {
        supertest_1.default(app_1.default)
            .get('/user/register')
            .then(response => {
            expect(response.status).toBe(200);
        });
    });
    test('contact route returns a 2000', () => {
        supertest_1.default(app_1.default)
            .get('/contact')
            .then(response => {
            expect(response.status).toBe(200);
        });
    });
    test('about page returns a 2000', () => {
        supertest_1.default(app_1.default)
            .get('/about')
            .then(response => {
            expect(response.status).toBe(200);
        });
    });
    test('pricing page returns a 2000', () => {
        supertest_1.default(app_1.default)
            .get('/pricing')
            .then(response => {
            expect(response.status).toBe(200);
        });
    });
    test('incorrect route', () => {
        supertest_1.default(app_1.default)
            .get('/4084084ng')
            .then(response => {
            expect(response.status).toBe(404);
        });
    });
    test('redirect user after login', () => {
        supertest_1.default(app_1.default)
            .post('/user/login')
            .send({
            email: 'test@test.com',
            password: 'test1'
        })
            .set('Accept', 'application/json')
            .then(res => {
            expect(res.redirect).toBe(true);
        });
    });
    test('goes to user profile after login', () => {
        supertest_1.default(app_1.default)
            .post('/user/login')
            .send({
            email: 'test@test.com',
            password: 'test'
        })
            .set('Accept', 'application/json')
            .then(res => {
            expect(res.redirect).toBe(true);
            expect(res.status).toBe(302);
        });
    });
    test('does not to user profile after login', () => {
        supertest_1.default(app_1.default)
            .post('/user/login')
            .send({
            email: 'test@test.com',
            password: 'test'
        })
            .set('Accept', 'application/json')
            .then(res => {
            expect(res.redirect).toBe(true);
            expect(res.status).toBe(302);
        });
    });
    test('logs user out sucessfully', () => {
        supertest_1.default(app_1.default)
            .get('/user/logout')
            .then(res => {
            expect(res.redirect).toBe(true);
        });
    });
});
