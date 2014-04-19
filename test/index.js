'use strict';

var sut = require('..');

describe('browserify plugin', function () {
  describe('when I add the plugin to a bundler', function () {
    var bundler, bundleSpy;

    beforeEach(function () {
      bundler = { bundle: bundleSpy = sinon.spy() };
      sut(bundler);
    });

    it('replaces the bundle function', function () {
      expect(bundler.bundle).is.a('function');
      expect(bundler.bundle).to.not.equal(bundleSpy);
    });

    describe('and then when I bundle with no args', function () {
      beforeEach(function () {
        bundler.bundle();
      });

      it('calls the original bundle with opts', function () {
        expect(bundleSpy).has.been.calledOnce;
        expect(bundleSpy).has.been.calledWithMatch({ insertGlobalVars: { global: sinon.match.func } }, undefined);
      });
    });


    describe('and then when I bundle with a callback function', function () {
      var cb;

      beforeEach(function () {
        bundler.bundle(cb = function () {});
      });

      it('calls the original bundle with opts and a callback', function () {
        expect(bundleSpy).has.been.calledOnce;
        expect(bundleSpy).has.been.calledWithMatch({ insertGlobalVars: { global: sinon.match.func } }, sinon.match.same(cb));
      });
    });


    describe('and then when I bundle with opts', function () {
      var insertGlobalVarsStub;

      beforeEach(function () {
        bundler.bundle({
          foo: 'bar',
          insertGlobalVars: insertGlobalVarsStub = function () {}
        });
      });

      it('calls the original bundle with opts, overriding insertGlobalVars', function () {
        expect(bundleSpy).has.been.calledOnce;
        expect(bundleSpy).has.been.calledWithMatch({
          foo: 'bar',
          insertGlobalVars: { global: match_differentFunc(insertGlobalVarsStub) }
        }, undefined);
      });
    });


    describe('and then when I bundle with opts and a callback function', function () {
      var insertGlobalVarsStub, cb;

      beforeEach(function () {
        bundler.bundle({
          foo: 'bar',
          insertGlobalVars: insertGlobalVarsStub = function () {}
        }, cb = function () {});
      });

      it('calls the original bundle with opts, overriding insertGlobalVars', function () {
        expect(bundleSpy).has.been.calledOnce;
        expect(bundleSpy).has.been.calledWithMatch({
          foo: 'bar',
          insertGlobalVars: { global: match_differentFunc(insertGlobalVarsStub) }
        }, sinon.match.same(cb));
      });
    });
  });
});

function match_differentFunc(fn) {
  return sinon.match(function(value) {
    return typeof value === 'function' && value !== fn;
  }, 'a different function');
}