# yartf

Yet Another Rest Test Framework   
    
`yartf` is simple http client helper for testing REST APIs.
    
It doesn't provide any assertions.

## Installation

    $ npm install yartf

## Usage

Make http get request, give alias to response results and make assertions on it

```javascript
var should = require('should');
var t = require('yartf');

it('should contain 0 tickets', function(done) {
	t('http://localhost:3000')
		.get('/tickets')
		.as('tickets')
		.assert(function(res) {

			// res.tickets === { status: 200, body: [] }

			res.tickets.status.should.be(200);
			res.tickets.body.length.should.be.exactly(0);
		})
		.exec(done);
});
```

Handle multiple request

```javascript
t('http://localhost:3000')
	.get('/tickets').as('tickets')
	.get('/users').as('users')
	.get('/cars').as('cars')
	.assert(function(res) {
		(res.tickets.length === res.cars.length &&
		res.tickets.length === res.users.length).should.be.ok;
	})
	.exec(done);
```


Shorthand for accessing last response body:

```javascript
t('http://localhost:3000')
	.get('/tickets')
	.as('tickets')
	.assert(function(res, tickets) {

		// tickets === res.tickets.body

		tickets.length.should.be.exactly(0);
	})
	.exec(done);
```

Reuse test steps

```javascript
var create_ticket = t('http://localhost:3000')
	.post('/tickets', { email: 'booo@example.com' })
	.as('ticket')
	.assert(function(res, ticket) {
		ticket.id.should.be.ok;
	});

var remove_ticket_by_email = t('http://localhost:3000')
	.use(create_ticket)
	.del('/tickets', { email: 'booo@example.com' })
	.as('ticket_removal')
	.assert(function(res, ticket_removal) {
		res.ticket_removal.status.should.be(200);
	})
	.exec(done);
```

Use previous response results in future requests via url templating

```javascript
return t(base_url)
	.post('/tickets', { email: 'boooo@example.com' })
	.as('ticket')
	.get('/tickets/{{ticket.body.id}}')
	.as('ticket_by_id')
	.assert(function(res, ticket_by_id) {
		ticket_by_id.email.should.be.exactly('boooo@example.com');
	})
	.exec(done);
```

Async assertions

```javascript
t('http://localhost:3000')
	.get('/tickets')
	.as('tickets')
	.assert_async(function(res, tickets, next) {
		someAsyncStuff(function(result) {
			tickets.length.should.be.equal(result.length);
			next();
		});
	})
	.exec(done);
```

## Assertions

To make assertions use some of these beautiful assertion libraries: [should](https://www.npmjs.org/package/should), [expect](https://www.npmjs.org/package/expect), [assert](https://www.npmjs.org/package/assert)

## Debug output

You can start test in debug mode. You can log different parts of response data using `body`, `headers`:

Will output `headers` and `body` of every request:
```javascript
t.debug = ['headers', 'body']

t('http://localhost:3000')
	.get('/users')
	//...
```

# License

The MIT License (MIT)
Copyright (c) 2014 Egor Gumenyuk <boo1ean0807@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
