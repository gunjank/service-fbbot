'use strict';

var should = require('should'),
  config = require('../')(__dirname),
  debug = require('debug')('config-local:test/spec');

describe('config-local', function() {

  it('should read from the parent AND the child', function() {
    (config).should.be.an.Object.with.properties([
      'parent',
      'parentTest',
      'child',
      'childTest'
    ]);
  });

});
