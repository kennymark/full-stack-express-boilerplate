export function logger(req, res, next) {
	console.log('Time:', Date.now(), req.originalUrl, req.method);
	next();
}
