var request = require('request');
var _ = require('lodash');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var Request = function(opt) {
	this.opt = opt;
};

var compose_url = function(ctx, path) {
	if (!path) {
		return ctx.base_url;
	}

	return ctx.base_url + _.template(path)(ctx.res);
};

Request.prototype.exec = function(next) {
	var ctx = this.ctx;

	var options = {
		url: compose_url(ctx, this.opt.url),
		method: this.opt.method,
		jar: true
	};

	if (this.opt.method == 'GET') {
		options.qs = this.opt.body || null;
	} else if (this.opt.method === 'POST' || this.opt.method === 'PUT') {
		options.form = this.opt.body || null;
	}

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
