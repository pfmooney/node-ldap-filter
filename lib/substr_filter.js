var assert = require('assert-plus');

var helpers = require('./helpers');


///--- Helpers

function escapeRegExp(str) {
  /* JSSTYLED */
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}


///--- API

function SubstringFilter(options) {
  if (typeof (options) === 'object') {
    assert.string(options.attribute, 'options.attribute');

    this.attribute = options.attribute;
    this.initial = options.initial ? options.initial : null;
    this.any = options.any ? options.any.slice(0) : [];
    this.final = options.final || null;
  } else {
    this.any = [];
  }

  var self = this;
  this.__defineGetter__('type', function () { return 'substring'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'SubstringMatch',
      initial: self.initial || undefined,
      any: self.any || undefined,
      final: self.final || undefined
    };
  });
}


SubstringFilter.prototype.toString = function () {
  var str = '(' + helpers.escape(this.attribute) + '=';

  if (this.initial)
    str += helpers.escape(this.initial);

  str += '*';

  this.any.forEach(function (s) {
    str += helpers.escape(s) + '*';
  });

  if (this.final)
    str += helpers.escape(this.final);

  str += ')';

  return str;
};


SubstringFilter.prototype.matches = function (target) {
  assert.object(target, 'target');

  var tv = helpers.getAttrCaseless(target, this.attribute);

  if (tv !== null) {
    var re = '';

    if (this.initial)
      re += '^' + escapeRegExp(this.initial) + '.*';
    this.any.forEach(function (s) {
      re += escapeRegExp(s) + '.*';
    });
    if (this.final)
      re += escapeRegExp(this.final) + '$';

    var matcher = new RegExp(re);
    return helpers.multiTest(function (v) {
      return matcher.test(v);
    }, tv);
  }

  return false;
};


///--- Exports

module.exports = SubstringFilter;
