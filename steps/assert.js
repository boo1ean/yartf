var Assert = function(opt) {
	this.opt = opt;
};

Assert.prototype.exec = function(next) {
	var ctx = this.ctx;
	this.opt.func.call(ctx, ctx.res);
	next();
};

module.exports = Assert;
