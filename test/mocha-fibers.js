var assert = require('assert');
var Fiber = require('fibers');
var exec = require('child_process').exec;

var MOCHA_BIN = './node_modules/.bin/mocha --ui ../../../lib/mocha-fibers.js'

describe('mocha-fibers', function(){
  this.timeout(5000);

  beforeEach(function(){
    assert(Fiber.current);
  });

  it('should be in fiber', function(){
    assert(Fiber.current);
  });

  it('should callback with sync errors', function(done){
    exec(MOCHA_BIN+' test/fixtures/sync_error.js', function(err, stdout, stderr) {
      assert(stderr.match(/mocha-fibers should callback with sync errors/));
      assert(stderr.match(/ReferenceError: xxx is not defined/));
      done();
    });
  });

  it('should callback with async errors', function(done){
    exec(MOCHA_BIN+' test/fixtures/async_error.js', function(err, stdout, stderr) {
      assert(stderr.match(/mocha-fibers should callback with async errors/));
      assert(stderr.match(/Error: foo/));
      done();
    });
  });

  describe('skipped tests', function() {
    it.skip('should not run', function() {
      assert(false);
    });
  });
});
