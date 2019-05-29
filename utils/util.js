import moment from 'moment/moment'

const time = moment()
const date = moment().format('MMMM Do YYYY')

export function logger(req, res, next) {
	console.log('Time:', Date.now(), req.originalUrl, req.method)
	next()
}

export function setLocals(req, res, next) {
	res.locals.year = time.year()
	res.locals.date = date
	res.locals.user = req.user
	next()
}
