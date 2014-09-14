var Assert = function(opt) {
	this.opt = opt;
};

// Dirty trick
var get_last_body = function(res) {
	var keys = Object.keys(res);
	return res[keys[keys.length - 1]].body;
};

Assert.prototype.exec = function(next) {
	var ctx = this.ctx;
	var last_body = get_last_body(ctx.res);

	this.opt.func.call(ctx, ctx.res, last_body);

	next();
};

module.exports = Assert;
