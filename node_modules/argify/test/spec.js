var should = require('should'),
  args = require('../');

describe('argify', function () {

  it('should return an object', function (done) {
    (args).should.be.an.Object;
    done();
  });

  it('should have a property "foo" == "bar"', function (done) {
    (args.foo).should.equal('bar');
    done();
  });

  it('should have a property "baz" == true', function (done) {
    (args.baz === true).should.equal(true);
    done();
  });

});
