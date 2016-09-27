// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2015 Patrick Mooney
// Copyright 2016 Joyent, Inc.

var test = require('tape').test;


///--- Globals

var EqualityFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  t.ok(filters);
  EqualityFilter = filters.EqualityFilter;
  t.ok(EqualityFilter);
  t.end();
});


test('Construct no args', function (t) {
  var f = new EqualityFilter();
  t.ok(f);
  t.ok(!f.attribute);
  t.ok(!f.value);
  t.end();
});


test('Construct args', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar');
  t.equal(f.toString(), '(foo=bar)');
  t.deepEqual(f.json, {
    type: 'EqualityMatch',
    attribute: 'foo',
    value: 'bar'
  });
  t.end();
});


test('construct with raw', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    raw: new Buffer([240])
  });
  t.ok(f);
  t.ok(f.raw);
  t.equal(f.raw[0], 240);
  t.end();
});


test('value setter', function (t) {
  var f = new EqualityFilter();
  var data = new Buffer([240]);
  f.value = data;
  t.equal(f.raw[0], data[0], 'preserve buffer');

  data = new Buffer('a');
  f.value = data.toString();
  t.equal(f.raw[0], data[0], 'convert string');

  f.value = true;
  t.equal(typeof (f.value), 'boolean', 'preserve other type');
  t.ok(f.value);
  t.end();
});


test('escape value only in toString()', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    value: 'ba(r)'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'ba(r)');
  t.equal(f.toString(), '(foo=ba\\28r\\29)');
  t.end();
});


test('match true', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(f.matches({ foo: 'bar' }));
  t.end();
});


test('match multiple', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(f.matches({ foo: ['plop', 'bar'] }));
  t.end();
});


test('match false', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(!f.matches({ foo: 'baz' }));
  t.end();
});


test('escape EqualityFilter inputs', function (t) {
  var f = new EqualityFilter({
    attribute: '(|(foo',
    value: 'bar))('
  });

  t.equal(f.attribute, '(|(foo');
  t.equal(f.value, 'bar))(');
  t.equal(f.toString(), '(\\28|\\28foo=bar\\29\\29\\28)');

  f.value = new Buffer([97, 115, 100, 102, 41, 40, 0, 255]);
  t.equal(f.toString(), '(\\28|\\28foo=\\61\\73\\64\\66\\29\\28\\00\\ff)');

  f.value = new Buffer([195, 40]);
  t.equal(f.toString(), '(\\28|\\28foo=\\c3\\28)');

  f.value = new Buffer([195, 177]);
  t.equal(f.toString(), '(\\28|\\28foo=ñ)');
  t.end();
});


test('reject bad raw value', function (t) {
  var f = new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.equal(f.toString(), '(foo=bar)');
  f.raw = 'sure';
  t.equal(f.toString(), '(foo=sure)');
  f.raw = {bogus: 'yup'};
  t.throws(function () {
    f.toString();
  });
  t.end();
});
