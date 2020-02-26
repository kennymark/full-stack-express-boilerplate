
import request from 'supertest';
import app from '../app';
import { accountify } from '../controllers/user.controller';
import { Account } from '../data/routes';

describe('Test routes', () => {

  test('home route return a 2000', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200);
  });

  test('login route returns a 2000', async () => {
    const res = await request(app).get(accountify(Account.login))
    expect(res.status).toBe(200);
  });

  test('register route returns a 2000', async () => {
    const res = await request(app).get(accountify(Account.register))
    expect(res.status).toBe(200);
  });

  test('contact route returns a 2000', async () => {
    const res = await request(app).get('/contact')
    expect(res.status).toBe(200);
  });

  test('about page returns a 2000', async () => {
    const res = await request(app).get('/about')

    expect(res.status).toBe(200);

  });

  test('pricing page returns a 2000', async () => {
    const res = await request(app).get('/pricing')
    expect(res.status).toBe(200);

  });

  test('incorrect route', async () => {
    const res = await request(app).get('/4084084ng')
    expect(res.status).toBe(404);
  });


  test('redirect user after login', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({ email: 'test@test.com', password: 'test1' })
      .set('Accept', 'application/json')

    expect(res.redirect).toBe(true);

  });

  test('goes to user profile after login', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({ email: 'test@test.com', password: 'test' })
      .set('Accept', 'application/json')

    expect(res.redirect).toBe(true);
    expect(res.status).toBe(302);

  });

  test('does not to user profile after login', async () => {
    const res = await request(app)
      .post(accountify(Account.login))
      .send({ email: 'test@test.com', password: 'test' })
      .set('Accept', 'application/json')

    expect(res.redirect).toBe(true);
    expect(res.status).toBe(302);

  });


  test('logs user out sucessfully', async () => {
    const res = await request(app).get('/user/logout')
    expect(res.redirect).toBe(true);
  });
})