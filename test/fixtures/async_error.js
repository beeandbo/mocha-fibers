
describe('mocha-fibers', function(){
  it('should callback with async errors', function(done) {
    process.nextTick(function() {
      done(new Error('foo'));
    });
  });
});

