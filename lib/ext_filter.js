// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var assert = require('assert-plus');


///--- API

function ExtensibleFilter(options) {
  if (typeof (options) === 'object') {
    assert.optionalString(options.rule, 'options.rule');
    assert.optionalString(options.matchType, 'options.matchType');
    assert.optionalString(options.value, 'options.value');
  } else {
    options = {};
  }

  this.matchType = options.matchType;
  this.dnAttributes = options.dnAttributes || false;
  this.rule = options.rule;
  this.value = (options.value !== undefined) ? options.value : '';

  var self = this;
  this.__defineGetter__('type', function () { return 'ext'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'ExtensibleMatch',
      matchRule: self.rule,
      matchType: self.matchType,
      matchValue: self.value,
      dnAttributes: self.dnAttributes
    };
  });
  this.__defineGetter__('matchingRule', function () {
    return self.rule;
  });
  this.__defineGetter__('matchValue', function () {
    return self.value;
  });
}


ExtensibleFilter.prototype.toString = function () {
  var str = '(';

  if (this.matchType)
    str += this.matchType;

  str += ':';

  if (this.dnAttributes)
    str += 'dn:';

  if (this.rule)
    str += this.rule + ':';

  return (str + '=' + this.value + ')');
};


ExtensibleFilter.prototype.matches = function (target) {
  // Consumers must implement this themselves
  throw new Error('ext match implementation missing');
};


///--- Exports

module.exports = ExtensibleFilter;
