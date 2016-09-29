// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.
// Copyright 2016 Joyent, Inc.

var test = require('tape').test;

var parse = require('../lib/index').parse;


function checkFilters(t, filters) {
  filters.forEach(function (filter) {
    var f = parse(filter.str);
    t.ok(f, 'Parsed "' + filter.str + '"');
    t.equal(f.type, filter.type);
    t.equal(f.attribute, 'foo');
    t.equal(f.value, filter.val);
    t.equal(f.toString(), filter.output);
  });
  t.end();
}


///--- Tests

test('XML Strings in filter', function (t) {
  var str = '(&(CentralUIEnrollments=<mydoc>*)(objectClass=User))';
  var f = parse(str);
  t.ok(f);
  t.ok(f.filters);
  t.equal(f.filters.length, 2);
  f.filters.forEach(function (filter) {
    t.ok(filter.attribute);
  });
  t.end();
});


test('= in filter', function (t) {
  var str = '(uniquemember=uuid=930896af-bf8c-48d4-885c-6573a94b1853, ' +
    'ou=users, o=smartdc)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.attribute, 'uniquemember');
  t.equal(f.value,
    'uuid=930896af-bf8c-48d4-885c-6573a94b1853, ou=users, o=smartdc');
  t.equal(f.toString(),
    '(uniquemember=uuid=930896af-bf8c-48d4-885c-6573a94b1853, ' +
    'ou=users, o=smartdc)');
  t.end();
});


test('( in filter', function (t) {
  var str = 'foo=bar\\28';
  var f = parse(str);
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar(');
  t.equal(f.toString(), '(foo=bar\\28)');
  t.end();
});


test(') in filter', function (t) {
  var str = '(foo=bar\\29)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar)');
  t.equal(f.toString(), '(foo=bar\\29)');
  t.end();
});


test('() in filter', function (t) {
  var str = 'foobar=baz\\28\\29';
  var f = parse(str);
  t.ok(f);
  t.equal(f.attribute, 'foobar');
  t.equal(f.value, 'baz()');
  t.equal(f.toString(), '(foobar=baz\\28\\29)');
  console.log(f.toString());
  var f2 = parse(f.toString());
  t.equal(f.toString(), f2.toString());
  t.end();
});


test(')( in filter', function (t) {
  var str = 'foobar=baz\\29\\28';
  var f = parse(str);
  t.ok(f);
  t.equal(f.attribute, 'foobar');
  t.equal(f.value, 'baz)(');
  t.equal(f.toString(), '(foobar=baz\\29\\28)');
  t.end();
});


test('newlines in filter', function (t) {
  var v1 = '\n';
  var v2 = 'bar\n';
  var v3 = '\nbar';
  checkFilters(t, [
    { str: '(foo=\n)', type: 'equal', val: v1, output: '(foo=\n)' },
    { str: '(foo<=\n)', type: 'le', val: v1, output: '(foo<=\n)' },
    { str: '(foo>=\n)', type: 'ge', val: v1, output: '(foo>=\n)' },
    { str: '(foo=\\0a)', type: 'equal', val: v1, output: '(foo=\n)' },
    { str: '(foo<=\\0a)', type: 'le', val: v1, output: '(foo<=\n)' },
    { str: '(foo>=\\0a)', type: 'ge', val: v1, output: '(foo>=\n)' },
    { str: '(foo=bar\n)', type: 'equal', val: v2, output: '(foo=bar\n)' },
    { str: '(foo<=bar\n)', type: 'le', val: v2, output: '(foo<=bar\n)' },
    { str: '(foo>=bar\n)', type: 'ge', val: v2, output: '(foo>=bar\n)' },
    { str: '(foo=bar\\0a)', type: 'equal', val: v2, output: '(foo=bar\n)' },
    { str: '(foo<=bar\\0a)', type: 'le', val: v2, output: '(foo<=bar\n)' },
    { str: '(foo>=bar\\0a)', type: 'ge', val: v2, output: '(foo>=bar\n)' },
    { str: '(foo=\nbar)', type: 'equal', val: v3, output: '(foo=\nbar)' },
    { str: '(foo<=\nbar)', type: 'le', val: v3, output: '(foo<=\nbar)' },
    { str: '(foo>=\nbar)', type: 'ge', val: v3, output: '(foo>=\nbar)' },
    { str: '(foo=\\0abar)', type: 'equal', val: v3, output: '(foo=\nbar)' },
    { str: '(foo<=\\0abar)', type: 'le', val: v3, output: '(foo<=\nbar)' },
    { str: '(foo>=\\0abar)', type: 'ge', val: v3, output: '(foo>=\nbar)' },
  ]);
});


test('carriage returns in filter', function (t) {
  var v1 = '\r';
  var v2 = 'bar\r';
  var v3 = '\rbar';
  checkFilters(t, [
    { str: '(foo=\r)', type: 'equal', val: v1, output: '(foo=\r)' },
    { str: '(foo<=\r)', type: 'le', val: v1, output: '(foo<=\r)' },
    { str: '(foo>=\r)', type: 'ge', val: v1, output: '(foo>=\r)' },
    { str: '(foo=\\0d)', type: 'equal', val: v1, output: '(foo=\r)' },
    { str: '(foo<=\\0d)', type: 'le', val: v1, output: '(foo<=\r)' },
    { str: '(foo>=\\0d)', type: 'ge', val: v1, output: '(foo>=\r)' },
    { str: '(foo=bar\r)', type: 'equal', val: v2, output: '(foo=bar\r)' },
    { str: '(foo<=bar\r)', type: 'le', val: v2, output: '(foo<=bar\r)' },
    { str: '(foo>=bar\r)', type: 'ge', val: v2, output: '(foo>=bar\r)' },
    { str: '(foo=bar\\0d)', type: 'equal', val: v2, output: '(foo=bar\r)' },
    { str: '(foo<=bar\\0d)', type: 'le', val: v2, output: '(foo<=bar\r)' },
    { str: '(foo>=bar\\0d)', type: 'ge', val: v2, output: '(foo>=bar\r)' },
    { str: '(foo=\rbar)', type: 'equal', val: v3, output: '(foo=\rbar)' },
    { str: '(foo<=\rbar)', type: 'le', val: v3, output: '(foo<=\rbar)' },
    { str: '(foo>=\rbar)', type: 'ge', val: v3, output: '(foo>=\rbar)' },
    { str: '(foo=\\0dbar)', type: 'equal', val: v3, output: '(foo=\rbar)' },
    { str: '(foo<=\\0dbar)', type: 'le', val: v3, output: '(foo<=\rbar)' },
    { str: '(foo>=\\0dbar)', type: 'ge', val: v3, output: '(foo>=\rbar)' },
  ]);
});


test('tabs in filter', function (t) {
  var v1 = '\t';
  var v2 = 'bar\t';
  var v3 = '\tbar';
  checkFilters(t, [
    { str: '(foo=\t)', type: 'equal', val: v1, output: '(foo=\t)' },
    { str: '(foo<=\t)', type: 'le', val: v1, output: '(foo<=\t)' },
    { str: '(foo>=\t)', type: 'ge', val: v1, output: '(foo>=\t)' },
    { str: '(foo=\\09)', type: 'equal', val: v1, output: '(foo=\t)' },
    { str: '(foo<=\\09)', type: 'le', val: v1, output: '(foo<=\t)' },
    { str: '(foo>=\\09)', type: 'ge', val: v1, output: '(foo>=\t)' },
    { str: '(foo=bar\t)', type: 'equal', val: v2, output: '(foo=bar\t)' },
    { str: '(foo<=bar\t)', type: 'le', val: v2, output: '(foo<=bar\t)' },
    { str: '(foo>=bar\t)', type: 'ge', val: v2, output: '(foo>=bar\t)' },
    { str: '(foo=bar\\09)', type: 'equal', val: v2, output: '(foo=bar\t)' },
    { str: '(foo<=bar\\09)', type: 'le', val: v2, output: '(foo<=bar\t)' },
    { str: '(foo>=bar\\09)', type: 'ge', val: v2, output: '(foo>=bar\t)' },
    { str: '(foo=\tbar)', type: 'equal', val: v3, output: '(foo=\tbar)' },
    { str: '(foo<=\tbar)', type: 'le', val: v3, output: '(foo<=\tbar)' },
    { str: '(foo>=\tbar)', type: 'ge', val: v3, output: '(foo>=\tbar)' },
    { str: '(foo=\\09bar)', type: 'equal', val: v3, output: '(foo=\tbar)' },
    { str: '(foo<=\\09bar)', type: 'le', val: v3, output: '(foo<=\tbar)' },
    { str: '(foo>=\\09bar)', type: 'ge', val: v3, output: '(foo>=\tbar)' },
  ]);
});


test('spaces in filter', function (t) {
  var v1 = ' ';
  var v2 = 'bar ';
  var v3 = ' bar';
  checkFilters(t, [
    { str: '(foo= )', type: 'equal', val: v1, output: '(foo= )' },
    { str: '(foo<= )', type: 'le', val: v1, output: '(foo<= )' },
    { str: '(foo>= )', type: 'ge', val: v1, output: '(foo>= )' },
    { str: '(foo=\\20)', type: 'equal', val: v1, output: '(foo= )' },
    { str: '(foo<=\\20)', type: 'le', val: v1, output: '(foo<= )' },
    { str: '(foo>=\\20)', type: 'ge', val: v1, output: '(foo>= )' },
    { str: '(foo=bar )', type: 'equal', val: v2, output: '(foo=bar )' },
    { str: '(foo<=bar )', type: 'le', val: v2, output: '(foo<=bar )' },
    { str: '(foo>=bar )', type: 'ge', val: v2, output: '(foo>=bar )' },
    { str: '(foo=bar\\20)', type: 'equal', val: v2, output: '(foo=bar )' },
    { str: '(foo<=bar\\20)', type: 'le', val: v2, output: '(foo<=bar )' },
    { str: '(foo>=bar\\20)', type: 'ge', val: v2, output: '(foo>=bar )' },
    { str: '(foo= bar)', type: 'equal', val: v3, output: '(foo= bar)' },
    { str: '(foo<= bar)', type: 'le', val: v3, output: '(foo<= bar)' },
    { str: '(foo>= bar)', type: 'ge', val: v3, output: '(foo>= bar)' },
    { str: '(foo=\\20bar)', type: 'equal', val: v3, output: '(foo= bar)' },
    { str: '(foo<=\\20bar)', type: 'le', val: v3, output: '(foo<= bar)' },
    { str: '(foo>=\\20bar)', type: 'ge', val: v3, output: '(foo>= bar)' },
  ]);
});


test('literal \\ in filter', function (t) {
  var v1 = 'bar\\';
  var v2 = '\\bar\\baz\\';
  var v3 = '\\';
  checkFilters(t, [
    { str: '(foo=bar\\5c)', type: 'equal', val: v1, output: '(foo=bar\\5c)' },
    { str: '(foo<=bar\\5c)', type: 'le', val: v1, output: '(foo<=bar\\5c)' },
    { str: '(foo>=bar\\5c)', type: 'ge', val: v1, output: '(foo>=bar\\5c)' },
    { str: '(foo=\\5cbar\\5cbaz\\5c)', type: 'equal', val: v2,
      output: '(foo=\\5cbar\\5cbaz\\5c)' },
    { str: '(foo>=\\5cbar\\5cbaz\\5c)', type: 'ge', val: v2,
      output: '(foo>=\\5cbar\\5cbaz\\5c)' },
    { str: '(foo<=\\5cbar\\5cbaz\\5c)', type: 'le', val: v2,
      output: '(foo<=\\5cbar\\5cbaz\\5c)' },
    { str: '(foo=\\5c)', type: 'equal', val: v3, output: '(foo=\\5c)' },
    { str: '(foo<=\\5c)', type: 'le', val: v3, output: '(foo<=\\5c)' },
    { str: '(foo>=\\5c)', type: 'ge', val: v3, output: '(foo>=\\5c)' }
  ]);
});


test('\\0 in filter', function (t) {
  var str = '(foo=bar\\00)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar\0');
  t.equal(f.toString(), '(foo=bar\\00)');
  t.end();
});


test('literal * in filters', function (t) {
  var v1 = 'bar*';
  var v2 = '*bar*baz*';
  var v3 = '*';
  checkFilters(t, [
    { str: '(foo=bar\\2a)', type: 'equal', val: v1, output: '(foo=bar\\2a)' },
    { str: '(foo<=bar\\2a)', type: 'le', val: v1, output: '(foo<=bar\\2a)' },
    { str: '(foo>=bar\\2a)', type: 'ge', val: v1, output: '(foo>=bar\\2a)' },
    { str: '(foo=\\2abar\\2abaz\\2a)', type: 'equal', val: v2,
      output: '(foo=\\2abar\\2abaz\\2a)' },
    { str: '(foo>=\\2abar\\2abaz\\2a)', type: 'ge', val: v2,
      output: '(foo>=\\2abar\\2abaz\\2a)' },
    { str: '(foo<=\\2abar\\2abaz\\2a)', type: 'le', val: v2,
      output: '(foo<=\\2abar\\2abaz\\2a)' },
    { str: '(foo=\\2a)', type: 'equal', val: v3, output: '(foo=\\2a)' },
    { str: '(foo<=\\2a)', type: 'le', val: v3, output: '(foo<=\\2a)' },
    { str: '(foo>=\\2a)', type: 'ge', val: v3, output: '(foo>=\\2a)' }
  ]);
});


test('* substr filter (prefix)', function (t) {
  var str = '(foo=bar*)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.type, 'substring');
  t.equal(f.attribute, 'foo');
  t.equal(f.initial, 'bar');
  t.equal(f.any.length, 0);
  t.equal(f.final, '');
  t.equal(f.toString(), '(foo=bar*)');
  t.end();
});


test('* substr filter (suffix)', function (t) {
  var str = '(foo=*bar)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.type, 'substring');
  t.equal(f.attribute, 'foo');
  t.equal(f.initial, '');
  t.equal(f.any.length, 0);
  t.equal(f.final, 'bar');
  t.equal(f.toString(), '(foo=*bar)');
  t.end();
});


test('escaped * in substr filter (prefix)', function (t) {
  var str = '(foo=bar\\2a*)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.type, 'substring');
  t.equal(f.attribute, 'foo');
  t.equal(f.initial, 'bar*');
  t.equal(f.any.length, 0);
  t.equal(f.final, '');
  t.equal(f.toString(), '(foo=bar\\2a*)');
  t.end();
});


test('escaped * in substr filter (suffix)', function (t) {
  var str = '(foo=*bar\\2a)';
  var f = parse(str);
  t.ok(f);
  t.equal(f.type, 'substring');
  t.equal(f.attribute, 'foo');
  t.equal(f.initial, '');
  t.equal(f.any.length, 0);
  t.equal(f.final, 'bar*');
  t.equal(f.toString(), '(foo=*bar\\2a)');
  t.end();
});


test('NotFilter', function (t) {
  var str = '(&(objectClass=person)(!(objectClass=shadowAccount)))';
  var f = parse(str);
  t.ok(f);
  t.equal(f.type, 'and');
  t.equal(f.filters.length, 2);
  t.equal(f.filters[0].type, 'equal');
  t.equal(f.filters[1].type, 'not');
  t.equal(f.filters[1].filter.type, 'equal');
  t.equal(f.filters[1].filter.attribute, 'objectClass');
  t.equal(f.filters[1].filter.value, 'shadowAccount');
  t.end();
});


test('presence filter', function (t) {
  var f = parse('(foo=*)');
  t.ok(f);
  t.equal(f.type, 'present');
  t.equal(f.attribute, 'foo');
  t.equal(f.toString(), '(foo=*)');
  t.end();
});


test('or filter', function (t) {
  var f = parse('(|(foo=bar)(baz=bip))');
  t.ok(f);
  t.equal(f.type, 'or');
  t.equal(f.filters.length, 2);
  t.end();
});


test('approx filter', function (t) {
  var f = parse('(foo~=bar)');
  t.ok(f);
  t.equal(f.type, 'approx');
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar');
  t.end();
});


test('<= in filters', function (t) {
  checkFilters(t, [
    { str: '(foo=<=)', type: 'equal', val: '<=', output: '(foo=<=)' },
    { str: '(foo<=<=)', type: 'le', val: '<=', output: '(foo<=<=)' },
    { str: '(foo>=<=)', type: 'ge', val: '<=', output: '(foo>=<=)' },
    { str: '(foo=bar<=baz)', type: 'equal', val: 'bar<=baz',
      output: '(foo=bar<=baz)' },
    { str: '(foo<=bar<=baz)', type: 'le', val: 'bar<=baz',
      output: '(foo<=bar<=baz)' },
    { str: '(foo>=bar<=baz)', type: 'ge', val: 'bar<=baz',
      output: '(foo>=bar<=baz)' },
    { str: '(foo=bar<=)', type: 'equal', val: 'bar<=',
      output: '(foo=bar<=)' },
    { str: '(foo<=bar<=)', type: 'le', val: 'bar<=', output: '(foo<=bar<=)' },
    { str: '(foo>=bar<=)', type: 'ge', val: 'bar<=', output: '(foo>=bar<=)' }
  ]);
});


test('>= in filters', function (t) {
  checkFilters(t, [
    { str: '(foo=>=)', type: 'equal', val: '>=', output: '(foo=>=)' },
    { str: '(foo<=>=)', type: 'le', val: '>=', output: '(foo<=>=)' },
    { str: '(foo>=>=)', type: 'ge', val: '>=', output: '(foo>=>=)' },
    { str: '(foo=bar>=baz)', type: 'equal', val: 'bar>=baz',
      output: '(foo=bar>=baz)' },
    { str: '(foo<=bar>=baz)', type: 'le', val: 'bar>=baz',
      output: '(foo<=bar>=baz)' },
    { str: '(foo>=bar>=baz)', type: 'ge', val: 'bar>=baz',
      output: '(foo>=bar>=baz)' },
    { str: '(foo=bar>=)', type: 'equal', val: 'bar>=', output: '(foo=bar>=)' },
    { str: '(foo<=bar>=)', type: 'le', val: 'bar>=', output: '(foo<=bar>=)' },
    { str: '(foo>=bar>=)', type: 'ge', val: 'bar>=', output: '(foo>=bar>=)' }
  ]);
});


test('& in filters', function (t) {
  checkFilters(t, [
    { str: '(foo=&)', type: 'equal', val: '&', output: '(foo=&)' },
    { str: '(foo<=&)', type: 'le', val: '&', output: '(foo<=&)' },
    { str: '(foo>=&)', type: 'ge', val: '&', output: '(foo>=&)' },
    { str: '(foo=bar&baz)', type: 'equal', val: 'bar&baz',
      output: '(foo=bar&baz)' },
    { str: '(foo<=bar&baz)', type: 'le', val: 'bar&baz',
      output: '(foo<=bar&baz)' },
    { str: '(foo>=bar&baz)', type: 'ge', val: 'bar&baz',
      output: '(foo>=bar&baz)' },
    { str: '(foo=bar&)', type: 'equal', val: 'bar&', output: '(foo=bar&)' },
    { str: '(foo<=bar&)', type: 'le', val: 'bar&', output: '(foo<=bar&)' },
    { str: '(foo>=bar&)', type: 'ge', val: 'bar&', output: '(foo>=bar&)' }
  ]);
});


test('| in filters', function (t) {
  checkFilters(t, [
    { str: '(foo=|)', type: 'equal', val: '|', output: '(foo=|)' },
    { str: '(foo<=|)', type: 'le', val: '|', output: '(foo<=|)' },
    { str: '(foo>=|)', type: 'ge', val: '|', output: '(foo>=|)' },
    { str: '(foo=bar|baz)', type: 'equal', val: 'bar|baz',
      output: '(foo=bar|baz)' },
    { str: '(foo<=bar|baz)', type: 'le', val: 'bar|baz',
      output: '(foo<=bar|baz)' },
    { str: '(foo>=bar|baz)', type: 'ge', val: 'bar|baz',
      output: '(foo>=bar|baz)' },
    { str: '(foo=bar|)', type: 'equal', val: 'bar|', output: '(foo=bar|)' },
    { str: '(foo<=bar|)', type: 'le', val: 'bar|', output: '(foo<=bar|)' },
    { str: '(foo>=bar|)', type: 'ge', val: 'bar|', output: '(foo>=bar|)' }
  ]);
});


test('! in filters', function (t) {
  checkFilters(t, [
    { str: '(foo=!)', type: 'equal', val: '!', output: '(foo=!)' },
    { str: '(foo<=!)', type: 'le', val: '!', output: '(foo<=!)' },
    { str: '(foo>=!)', type: 'ge', val: '!', output: '(foo>=!)' },
    { str: '(foo=bar!baz)', type: 'equal', val: 'bar!baz',
      output: '(foo=bar!baz)' },
    { str: '(foo<=bar!baz)', type: 'le', val: 'bar!baz',
      output: '(foo<=bar!baz)' },
    { str: '(foo>=bar!baz)', type: 'ge', val: 'bar!baz',
      output: '(foo>=bar!baz)' },
    { str: '(foo=bar!)', type: 'equal', val: 'bar!', output: '(foo=bar!)' },
    { str: '(foo<=bar!)', type: 'le', val: 'bar!', output: '(foo<=bar!)' },
    { str: '(foo>=bar!)', type: 'ge', val: 'bar!', output: '(foo>=bar!)' }
  ]);
});


test('ge filter', function (t) {
  var f = parse('(foo>=5)');
  t.ok(f);
  t.equal(f.type, 'ge');
  t.equal(f.attribute, 'foo');
  t.equal(f.value, '5');
  t.end();
});


test('le filter', function (t) {
  var f = parse('(foo<=5)');
  t.ok(f);
  t.equal(f.type, 'le');
  t.equal(f.attribute, 'foo');
  t.equal(f.value, '5');
  t.end();
});


test('unicode in filter', function (t) {
  checkFilters(t, [
    { str: '(foo=☕⛵ᄨ)', type: 'equal',
      val: '☕⛵ᄨ', output: '(foo=☕⛵ᄨ)' },
    { str: '(foo<=☕⛵ᄨ)', type: 'le',
      val: '☕⛵ᄨ', output: '(foo<=☕⛵ᄨ)' },
    { str: '(foo>=☕⛵ᄨ)', type: 'ge',
      val: '☕⛵ᄨ', output: '(foo>=☕⛵ᄨ)' },
    { str: '(foo=ᎢᏣᎵᏍᎠᏁᏗ)', type: 'equal',
      val: 'ᎢᏣᎵᏍᎠᏁᏗ', output: '(foo=ᎢᏣᎵᏍᎠᏁᏗ)' },
    { str: '(foo<=ᎢᏣᎵᏍᎠᏁᏗ)', type: 'le',
      val: 'ᎢᏣᎵᏍᎠᏁᏗ', output: '(foo<=ᎢᏣᎵᏍᎠᏁᏗ)' },
    { str: '(foo>=ᎢᏣᎵᏍᎠᏁᏗ)', type: 'ge',
      val: 'ᎢᏣᎵᏍᎠᏁᏗ', output: '(foo>=ᎢᏣᎵᏍᎠᏁᏗ)' }
  ]);
});


test('bogus filters', function (t) {
  t.throws(function () {
    parse('foo>1');
  }, 'junk');

  t.throws(function () {
    parse('(&(valid=notquite)())');
  }, 'empty parens');

  t.throws(function () {
    parse('(&(valid=notquite)wut)');
  }, 'cruft inside AndFilter');

  t.throws(function () {
    parse('(bad=asd(fdsa)');
  }, 'unescaped paren');

  t.throws(function () {
    parse('bad=\\gg');
  }, 'bad hex escape');

  t.throws(function () {
    parse('foo!=1');
  }, 'fake operator');

  t.end();
});


test('mismatched parens', function (t) {
  t.throws(function () {
    parse('(&(foo=bar)(!(state=done))');
  });

  t.throws(function () {
    parse('(foo=1');
  }, 'missing last paren');

  t.throws(function () {
    parse('(foo=1\\29');
  }, 'missing last paren');

  t.throws(function () {
    parse('foo=1)');
  }, 'trailing paren');

  t.throws(function () {
    parse('foo=1))');
  }, 'trailing paren');

  t.throws(function () {
    parse('foo=1)a)');
  }, 'trailing paren');

  t.throws(function () {
    parse('(foo=1)trailing');
  }, 'trailing text');

  t.throws(function () {
    parse('leading(foo=1)');
  }, 'leading text');

  t.end();
});


test('garbage in subfilter not allowed', function (t) {
  t.throws(function () {
    parse('(&(foo=bar)|(baz=quux)(hello=world))');
  }, '| subfilter without parens not allowed');

  t.throws(function () {
    parse('(&(foo=bar)!(baz=quux)(hello=world))');
  }, '! subfilter without parens not allowed');

  t.throws(function () {
    parse('(&(foo=bar)&(baz=quux)(hello=world))');
  }, '& subfilter without parens not allowed');

  t.throws(function () {
    parse('(&(foo=bar)g(baz=quux)(hello=world))');
  });

  t.throws(function () {
    parse('(&(foo=bar)=(baz=quux)(hello=world))');
  });

  t.throws(function () {
    parse('(&foo=bar)');
  });

  t.throws(function () {
    parse('(|foo=bar)');
  });

  t.throws(function () {
    parse('(!foo=bar)');
  });

  t.end();
});


test('nested parens', function (t) {
  t.throws(function () {
    parse('((foo=bar))');
  });
  t.end();
});


test('tolerate underscores in names', function (t) {
  var f = parse('(foo_bar=val)');
  t.ok(f);
  t.equal(f.attribute, 'foo_bar');
  f = parse('(_leading=val)');
  t.ok(f);
  t.equal(f.attribute, '_leading');
  t.end();
});
