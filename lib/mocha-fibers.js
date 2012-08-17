// A copy of bdd interface, but beforeEach, afterEach, before, after,
// and it methods all run within fibers.

var mocha = require('mocha')
  , Suite = mocha.Suite
  , Test = mocha.Test
  , _ = require('underscore')
  , fibers = require('fibers')
  , util = require('util');

// Wrap a function in a fiber.  Correctly handles expected presence of
// done callback
fiberize = function(fn){    
  return function(done){

    var self = this;    
    Fiber(function(){

      try{
        if(fn.length == 1){
          fn.call(self, function(){             
            done();
          });
        } else {
          fn.call(self);
          done();
        }
      } catch(e) {
        process.nextTick(function(){
          throw(e);
        });
      }            

    }).run();

  }
}

// A copy of bdd interface, but wrapping everything in fibers
var ui = module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    // noop variants

    context.xdescribe = function(){};
    context.xit = function(){};

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
  
    context.describe = context.context = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };

    
    // Wrap test related methods in fiber
    ['beforeEach', 'afterEach', 'after', 'before', 'it'].forEach(function(method){      
      context[method] = _.wrap(context[method], function(fn){        
        var args = Array.prototype.slice.call(arguments, 1);
        if(_.isFunction(_.last(args))){
          args.push(fiberize(args.pop()));
        }
        fn.apply(this, args);
      });
    });

  });
};

var mocha = require('mocha');
mocha.interfaces.fibered = ui;
