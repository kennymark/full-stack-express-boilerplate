import jwt from 'jsonwebtoken'
import config from '../config/config'
import messages from '../data/messages'
import { Request, Response, NextFunction } from 'express'
class JwtConfig {

  // Extracts a jwt
  async extractAndVerify(req: Request, res: Response, next: NextFunction) {
    //Find the header
    const header = req.headers.authorization
    const token = header.split(' ')[1]
    const decoded = await jwt.verify(token, config.jwtSecret)
    if (!header) return res.redirect('/account/login')
    if (!decoded) req.flash('error', messages.login_session_expired)
    next()
  }
}
export default new JwtConfig()