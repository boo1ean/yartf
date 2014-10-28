var request = require('request');
var steps = require('./steps');
var _ = require('lodash');

var err = function(msg) {
	console.error(msg);
	return msg;
}

var Test = function(opts) {
	this.base_url = opts.base_url;
	this.debug = opts.debug;
	this.queue = [];
	this._req = [];
	this._res = [];
	this.req = {};
	this.res = {};
};

// Make http request
Test.prototype.request = function(url, method, body, opts) {
	return this.push_step(new steps.Request({
		url: url,
		method: method,
		body: body,
		debug: this.debug,
		opts: opts
	}));
};

// Different http request methods
Test.prototype.get = function(url, query, opts) {
	return this.request(url, 'GET', query, opts);
};

Test.prototype.post = function(url, body) {
	return this.request(url, 'POST', body, opts);
};

Test.prototype.put = function(url, body, opts) {
	return this.request(url, 'PUT', body, opts);
};

Test.prototype.del = function(url, body, opts) {
	return this.request(url, 'DELETE', body, opts);
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

// Make some async assertions
Test.prototype.assert_async = function(func) {
	return this.push_step(new steps.AssertAsync({ func: func }));
};

// Same as assert (for better tests semantic)
Test.prototype.step = function(func) {
	return this.push_step(new steps.Assert({ func: func }));
};

// Same as assert_async (for better tests semantic)
Test.prototype.step_async = function(func) {
	return this.push_step(new steps.AssertAsync({ func: func }));
};

// Extend test queue with another queue
Test.prototype.use = function(test) {
	var ctx = this;
	var queue = _.clone(test.queue).map(function(step) {
		step.ctx = ctx;
		return step;
	});

	this.queue = this.queue.concat(queue);
	return this;
};

// Execute the stuff
Test.prototype.exec = function(success, error) {
	if (!error) {
		error = success;
	}

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
	return new Test({ base_url: base_url, debug: create_test.debug });
};

create_test.debug = false;

module.exports = create_test;
