'use strict';

var fs = require('fs');
var _ = require('underscore');

var defaultGlobalVars = require('insert-module-globals').vars;
var defaultPrelude = fs.readFileSync(require.resolve('browser-pack/_prelude'), { encoding: 'utf8' });

module.exports = function(bundler) {
  bundler.bundle = _.wrap(bundler.bundle, bundle);
};

function bundle(fn, opts, cb) {
  // handle bundle(fn, cb) -> bundle(fn, undefined, cb);
  if (arguments.length === 2 && typeof opts === 'function') {
    cb = opts;
    opts = undefined;
  }

  return fn.call(this, applyOpts(opts), cb);
}

function applyOpts(opts) {
  if (opts && opts.__isExtendScriptOptsApplied) return opts;

  var overrideOpts = {
    prelude: makeGlobalPrelude() + (opts && opts.prelude || defaultPrelude),
    insertGlobalVars: _.extend({}, opts && opts.insertGlobalVars || defaultGlobalVars, insertGlobalVars)
  };

  var appliedOpts = opts ? _.defaults(overrideOpts, opts) : overrideOpts;
  return Object.defineProperty(appliedOpts, '__isExtendScriptOptsApplied', { value: true });
}

// ExtendScript doesn't have an object that has all of the types on it like `global` in Node or `window` in
// browsers, but all of the types are ambiently available, anyway. Just need to override the global object
// definition to hook everything up.

var insertGlobalVars = Object.freeze({
  global: function () { return '__browserifyGlobal'  }
});

function makeGlobalPrelude() {
  var types = [ 'Number', 'String', 'Object', 'Date', 'SyntaxError', 'TypeError', 'Math' ]
    .map(function (t) { return t + ': ' + t })
    .join(', ');

  return 'var __browserifyGlobal = { ' + types + ' }; __browserifyGlobal.global = __browserifyGlobal;\n';
}
