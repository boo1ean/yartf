var AssertAsync = function(opt) {
	this.opt = opt;
};

// Dirty trick
var get_last_body = function(res) {
	var keys = Object.keys(res);
	if (keys.length) {
		return res[keys[keys.length - 1]].body;
	}
};

AssertAsync.prototype.exec = function(next) {
	var ctx = this.ctx;
	var last_body = get_last_body(ctx.res);

	this.opt.func.call(ctx, ctx.res, last_body, next);
};

module.exports = AssertAsync;
