var assert = require('assert');
var Fiber = require('fibers');

describe('mocha-fibers', function(){
  this.timeout(5000);

  beforeEach(function(){
    assert(Fiber.current);
  });

  it('should be in fiber', function(){
    assert(Fiber.current);
  });
});
