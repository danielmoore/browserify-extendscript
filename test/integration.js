'use strict';

var sut = require('..');
var browserify = require('browserify');
var vm = require('vm');
var fs = require('fs');
var path = require('path');
var os = require('os');

describe('bundle result', function () {
  var err, src;

  beforeEach(function (done) {
    var tempModulePath = path.join(os.tmpdir(), '_test-module.js');
    fs.writeFileSync(tempModulePath, '__testResult = global;');

    var bundler = browserify(tempModulePath);
    bundler.plugin(sut);

    bundler.bundle(function (e, s) {
      err = e;
      src = s;
      done();
    });
  });

  it('bundles without an error', function () {
    expect(err).to.be.null;
  });

  describe('when executed', function () {
    var result;

    beforeEach(function () {
      var sandbox = {
        __testResult: null,
        Number: Number,
        String: String,
        Object: Object,
        Date: Date,
        SyntaxError: SyntaxError,
        TypeError: TypeError,
        Math: Math
      };

      vm.runInNewContext(src, sandbox);

      result = sandbox.__testResult;
    });

    it('has the basic types of JavaScript', function () {
      expect(result).to.include({
        Number: Number,
        String: String,
        Object: Object,
        Date: Date,
        SyntaxError: SyntaxError,
        TypeError: TypeError,
        Math: Math
      });
    });

    it('has a self-referential global property', function () {
      expect(result.global).to.equal(result);
    });
  })
});