export function errorFormatter(param, msg) {
	let namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

	while (namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	}
	return {
		msg: msg
	};
}
