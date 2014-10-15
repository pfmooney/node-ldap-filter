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
  t.end();
});
