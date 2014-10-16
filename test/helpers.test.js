// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var helpers;


///--- Tests

test('load library', function (t) {
  helpers = require('../lib/helpers');
  t.ok(helpers);
  t.end();
});


test('multiTest array', function (t) {
  var rule = function (item) {
    return (item == 3);
  };
  t.ok(helpers.multiTest(rule, [1, 2, 3]));
  t.ok(!helpers.multiTest(rule, [1, 2]));
  t.end();
});


test('multiTest value', function (t) {
  var rule = function (item) {
    return (item == 3);
  };
  t.ok(helpers.multiTest(rule, 3));
  t.ok(!helpers.multiTest(rule, 1));
  t.end();
});


test('getAttrCaseless exact match', function (t) {
  var f = helpers.getAttrCaseless;
  t.equal(f({attr: 'testval'}, 'attr'), 'testval');
  t.equal(f({attr: 'testval'}, 'missing'), null);
  t.end();
});


test('getAttrCaseless insensitive match', function (t) {
  var f = helpers.getAttrCaseless;
  var data = {
    lower: 'lower',
    UPPER: 'upper',
    MiXeD: 'mixed'
  };
  t.equal(f(data, 'lower'), 'lower');
  t.equal(f(data, 'upper'), 'upper');
  t.equal(f(data, 'mixed'), 'mixed');
  t.equal(f(data, 'missing'), null);
  t.end();
});
