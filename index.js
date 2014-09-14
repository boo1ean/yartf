var request = require('request');
var steps = require('./steps');

var err = function(msg) {
	console.error(msg);
	return msg;
}

var Test = function(opt) {
	this.base_url = opt.base_url;
	this.queue = [];
	this._req = [];
	this._res = [];
	this.req = {};
	this.res = {};
};

// Make http request
Test.prototype.request = function(url, method, body) {
	return this.push_step(new steps.Request({
		url: url,
		method: method,
		body: body
	}));
};

// Different http request methods
Test.prototype.get = function(url, query) {
	return this.request(url, 'GET', query);
};

Test.prototype.post = function(url, body) {
	return this.request(url, 'POST', body);
};

Test.prototype.put = function(url, body) {
	return this.request(url, 'PUT', body);
};

Test.prototype.del = function(url, body) {
	return this.request(url, 'DELETE', body);
};

// Give alias for response of previous step
Test.prototype.as = function(alias) {
	return this.push_step(new steps.Binding({ alias: alias }));
};

Test.prototype.push_step = function(step) {
	step.ctx = this;
	this.queue.push(step);
	return this;
};

// Make some assertions
Test.prototype.assert = function(func) {
	return this.push_step(new steps.Assert({ func: func }));
};

// Execute the stuff
Test.prototype.exec = function(success, error) {
	var queue = this.queue;

	if (!queue.length) {
		throw new Error(err('There are no test steps provided!'));
	}

	var next = function(err) {
		if (err) {
			return error(err);
		}

		if (!queue.length) {
			return success();
		}

		var step = queue.shift();
		step.exec(next);
	};

	next();
};

var create_test = function(base_url) {
	return new Test({ base_url: base_url });
};

module.exports = create_test;
