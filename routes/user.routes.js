import express from 'express';
import UserController from '../controllers/user.controller';
// import { check, validationResult } from 'express-validator/check';
import jwt from '../controllers/jwt';
let router = express.Router();
// const userValArr = [
// 	check('email', 'Email is not valid').isEmail(),
// 	check('password', 'Password is required').notEmpty()
// ];

router.get('/login', UserController.showLogin);
router.get('/profile', UserController.showProfile);
router.post('/login', UserController.postUserlogin);
router.get('/register', UserController.showRegister);
router.post('/register', UserController.postRegister);
router.get('/logout', UserController.logUserOut);
router.get('/user/:id');
// router.get('/admin', UserController.showAdmin);

export default router;
