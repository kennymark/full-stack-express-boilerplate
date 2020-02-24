import jwt from 'jsonwebtoken'
import config from '../config/config'
import messages from '../data/messages'
class JwtConfig {

  async extractAndVerify(req, res, next) {
    const header = req.headers.authorization
    if (!header) return res.redirect('/user/login')
    const token = header.split(' ')[1]
    const decoded = await jwt.verify(token, config.jwtSecret)
    next()
    if (!decoded) req.flash('error', messages.login_session_expired)
  }
}
export default new JwtConfig()