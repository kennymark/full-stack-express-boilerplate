import express from 'express';
import UserController from '../controllers/user.controller';
import jwt from '../controllers/jwt';
import passport from '../utils/passport.config';
let router = express.Router();

function authenticate() {
	passport.authenticate('twitter', { failureRedirect: '/user/login' });
}

router.get('/login', UserController.showLogin);

router.get('/profile', UserController.showProfile);
router.post('/login', UserController.postUserlogin);
router.get('/login/twitter', passport.authenticate('twitter'));
router.get('/oauth/twiiter_callback', authenticate, UserController.twitterLogin);
router.get('/register', UserController.showRegister);
router.post('/register', UserController.postRegister);
router.get('/logout', UserController.logUserOut);
router.delete('/delete/:id', UserController.deleteUser);

router.get('/edit/:id', UserController.showEdituser);
router.put('/edit/:id', UserController.updateUser);

// router.get('/user/:id'), UserController.;

export default router;
