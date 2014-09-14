# yartf

Yet Another Rest Test Framework   
    
`yartf` is simple http client helper for testing REST APIs.
    
It doesn't provide any assertions.

## Installation

    $ npm install yartf

## Usage

```javascript
var should = require('should');
var t = require('yartf');

it('should contain 0 tickets', function(done) {
	t('http://localhost:3000')
		.get('/tickets')
		.as('tickets')
		.assert(function() {
			this.res.status.should.be(200);
			this.res.body.tickets.length.should.be.exactly(0);
		})
		.exec(done, done);
}):
```

## Assertions

To make assertions use some of these beautiful assertion libraries: [should](https://www.npmjs.org/package/should), [expect](https://www.npmjs.org/package/expect), [assert](https://www.npmjs.org/package/assert)

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
