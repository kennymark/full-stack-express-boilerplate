import express from 'express';

const router = express.Router();

router.get('/', (req, res) =>
	res.render('index', { title: 'Home', date: new Date().getFullYear() })
);
export default router;
