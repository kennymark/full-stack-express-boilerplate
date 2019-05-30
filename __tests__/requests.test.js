import request from 'supertest';
import app from '../app';


describe('Test routes', () => {
	test('home route return a 2000', () => {
		request(app)
			.get('/')
			.then(response => {
				expect(response.status).toBe(200);
			});
	});

	test('login route returns a 2000', () => {
		request(app)
			.get('/user/login')
			.then(response => {
				expect(response.status).toBe(200);
			});
	});

	test('register route returns a 2000', () => {
		request(app)
			.get('/user/register')
			.then(response => {
				expect(response.status).toBe(200);
			});
	});

	test('contact route returns a 2000', () => {
		request(app)
			.get('/contact')
			.then(response => {
				expect(response.status).toBe(200);
			});
	});

	test('about page returns a 2000', () => {
		request(app)
			.get('/about')
			.then(response => {
				expect(response.status).toBe(200);
			});
	});

	test('pricing page returns a 2000', () => {
		request(app)
			.get('/pricing')
			.then(response => {
				expect(response.status).toBe(200);
			});
	});

	test('incorrect route', () => {
		request(app)
			.get('/4084084ng')
			.then(response => {
				expect(response.status).toBe(404);
			});
	});


	test('redirect user after login', () => {
		request(app)
			.post('/user/login')
			.send({
				email: 'test@test.com',
				password: 'test'
			})
			.set('Accept', 'application/json')
			.then(res => {
				expect(res.redirect).toBe(true);
			});
	});

	test('goes to user profile after login', () => {
		request(app)
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
		request(app)
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
		request(app)
			.get('/user/logout')
			.then(res => {
				expect(res.redirect).toBe(true);
				console.log(res.links)
			});
	});
})


