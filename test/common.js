'use strict';

global.chai = require('chai');
global.expect = require('chai').expect;
global.AssertionError = require('chai').AssertionError;

global.sinon = require('sinon');

global.swallow = function (thrower) {
  try {
    thrower();
  } catch (e) { }
};

var sc = require('sinon-chai');
chai.use(sc);
