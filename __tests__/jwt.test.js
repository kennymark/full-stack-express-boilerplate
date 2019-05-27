var jwt = require('../controllers/jwt');

describe('Test for jwt auth', () => {
	const testPayload = {
		name: 'kenny g',
		email: 'kennyg@gmail.com',
		password: 'kennythebest'
	};

	test('it generates a token with a given payload', () => {
		const token = jwt.default.encode(testPayload);
		expect(testPayload).toBeTruthy();
	});
});
