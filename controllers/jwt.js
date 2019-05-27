import jwt from 'jsonwebtoken';
import config from '../utils/config';
class JwtConfig {
	encode(payload) {
		return jwt.sign(payload, config.jwtSecret, {
			expiresIn: '2 days',
			issuer: 'Kenny Mark'
		});
	}

	decode(secret) {
		jwt.verify(this.token, secret, (err, decoded) => {
			if (err) throw new Error();
			return decoded;
		});
	}

	verify(req, res, next) {
		const excludedRoutes = 'login' || 'register';
		if (req.originalUrl.includes(excludedRoutes)) {
			next();
		} else {
			const header = req.headers.authorization;
			if (!header) {
				console.log('Please login as request does not include auth header');
				return res.redirect('/user/login');
			}
			const payload = header;
			req.token = payload;

			jwt.verify(req.token, config.jwtSecret, (err, decoded) => {
				if (err) return res.render('index', { error: 'Session has expired please login again' });
				return res.redirect(req.originalUrl);
			});
		}
	}
}
export default new JwtConfig();
