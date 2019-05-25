import jwt from 'jsonwebtoken';
import express from 'express';

class JwtConfig {
	token = '';

	encode({ payload, secret }) {
		return (this.token = jwt.sign(payload, secret, { expiresIn: '2 days', issuer: 'Kenny Mark' }));
	}

	decode(secret) {
		jwt.verify(this.token, secret, (err, decoded) => {
			if (err) throw new Error();
			return decoded;
		});
	}

	verify(req, res) {
		const header = !req.headers['Authorization'] || req.headers['authorization'];
		if (!header) {
			console.log('Please login as request does not include auth header');
			res.sendStatus(403).render('login');
		}
		const payload = header.split(' ')[1];
		req.token = payload;
	}
}

export default new JwtConfig();
