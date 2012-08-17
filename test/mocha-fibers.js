var assert = require('assert');
var Fiber = require('fibers');

describe('mocha-fibers', function(){
  beforeEach(function(){
	assert(Fiber.current);
  });

  it('should be in fiber', function(){
	assert(Fiber.current);
  });
});
