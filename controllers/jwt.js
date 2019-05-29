import jwt from 'jsonwebtoken'
import config from '../utils/config'
import messages from '../data/messages'
class JwtConfig {
	encode(payload) {
		return jwt.sign(payload, config.jwtSecret, config.jwtOptions)
	}

	decode(secret) {
		jwt.verify(this.token, secret, (err, decoded) => {
			if (err) throw new Error()
			return decoded
		})
	}

	async extractAndVerify(req, res, next) {
		const header = req.headers.authorization
		if (!header) return res.redirect('/user/login')
		const token = header.split(' ')[1]
		const decoded = jwt.verify(token, config.jwtSecret)
		if (!decoded) return res.render('index', { error: messages.login_session_expired })
		return res.redirect('/' + '?')
	}
}
export default new JwtConfig()
