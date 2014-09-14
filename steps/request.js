var request = require('request');

var Request = function(opt) {
	this.opt = opt;
};

Request.prototype.exec = function(next) {
	var ctx = this.ctx;

	var options = {
		url: ctx.base_url + this.opt.url,
		method: this.opt.method,
		qs: this.opt.method == 'GET' ? this.opt.body : null,
		form: this.opt.method == 'POST' ? this.opt.body : null
	};

	ctx._req.push(options);

	request(options, function(err, res, body) {
		if (err) {
			return next(err);
		}

		ctx._res.push(res);
		next();
	});
};

module.exports = Request;
