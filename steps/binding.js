var last = function(arr) {
	return arr[arr.length - 1];
};

var Binding = function(opt) {
	this.opt = opt;
};

var create_request = function(req) {
	return req;
};

var create_response = function(res) {
	try {
		var body = JSON.parse(res.body);
	} catch (e) {
		body = {};
	}

	return {
		status: res.statusCode,
		headers: res.headers,
		body: body
	};
};

Binding.prototype.exec = function(next) {
	var ctx = this.ctx;

	var req = last(ctx._req);
	var res = last(ctx._res);

	ctx.req[this.opt.alias] = create_request(req);
	ctx.res[this.opt.alias] = create_response(res);

	next();
};

module.exports = Binding;
