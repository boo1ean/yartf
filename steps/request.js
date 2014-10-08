var request = require('request');
var _ = require('lodash');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var Request = function(opts) {
	this.opts = opts;
};

var compose_url = function(ctx, path) {
	if (!path) {
		return ctx.base_url;
	}

	return ctx.base_url + _.template(path)(ctx.res);
};

Request.prototype.debug = function(req, res, body) {
	if (this.opts.debug) {
		console.log('\n------------Request------------\n');
		console.log(req);
	}

	if (this.opts.debug.indexOf('headers') != -1) {
		console.log('\n------------Response Headers------------\n');
		console.log(res.headers);
		console.log();
	}

	if (this.opts.debug.indexOf('body') != -1) {
		console.log('\n------------Response Body------------\n');
		console.log(res.body);
	}
};

Request.prototype.exec = function(next) {
	var ctx = this.ctx;
	var self = this;

	var options = {
		url: compose_url(ctx, this.opts.url),
		method: this.opts.method,
		jar: true
	};

	if (this.opts.method == 'GET') {
		options.qs = this.opts.body || null;
	} else if (this.opts.method === 'POST' || this.opts.method === 'PUT') {
		options.form = this.opts.body || null;
	}

	ctx._req.push(options);

	request(options, function(err, res, body) {
		if (err) {
			return next(err);
		}

		self.debug(options, res, body);
		ctx._res.push(res);
		next();
	});
};

module.exports = Request;
