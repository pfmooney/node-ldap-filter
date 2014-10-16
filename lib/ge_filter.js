// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var assert = require('assert-plus');

var helpers = require('./helpers');


///--- API

function GreaterThanEqualsFilter(options) {
  if (typeof (options) === 'object') {
    assert.string(options.attribute, 'options.attribute');
    assert.string(options.value, 'options.value');
    this.attribute = options.attribute;
    this.value = options.value;
  }

  var self = this;
  this.__defineGetter__('type', function () { return 'ge'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'GreaterThanEqualsMatch',
      attribute: self.attribute,
      value: self.value
    };
  });
}


GreaterThanEqualsFilter.prototype.toString = function () {
  return ('(' + helpers.escape(this.attribute) +
          '>=' + helpers.escape(this.value) + ')');
};


GreaterThanEqualsFilter.prototype.matches = function (target) {
  assert.object(target, 'target');

  var tv = helpers.getAttrCaseless(target, this.attribute);
  var value = this.value;

  return helpers.multiTest(function (v) {
    return value <= v;
  }, tv);
};


///--- Exports

module.exports = GreaterThanEqualsFilter;
