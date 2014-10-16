// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var assert = require('assert-plus');

var helpers = require('./helpers');


///--- API

function EqualityFilter(options) {
  if (typeof (options) === 'object') {
    assert.string(options.attribute, 'options.attribute');
    this.attribute = options.attribute;
    // Prefer Buffers over strings to make filter cloning easier
    if (options.raw && Buffer.isBuffer(options.raw)) {
      this.raw = options.raw;
    } else {
      this.raw = new Buffer(options.value);
    }
  } else {
    this.raw = new Buffer(0);
  }

  var self = this;
  this.__defineGetter__('type', function () { return 'equal'; });
  this.__defineGetter__('value', function () {
    return self.raw.toString();
  });
  this.__defineSetter__('value', function (data) {
    if (typeof (data) === 'string') {
      self.raw = new Buffer(data);
    } else if (Buffer.isBuffer(data)) {
      self.raw = new Buffer(data.length);
      data.copy(self.raw);
    } else {
      throw new TypeError('value (string|buffer) required');
    }
  });
  this.__defineGetter__('json', function () {
    return {
      type: 'EqualityMatch',
      attribute: self.attribute,
      value: self.value
    };
  });
}


EqualityFilter.prototype.toString = function () {
  return ('(' + helpers.escape(this.attribute) +
          '=' + helpers.escape(this.value) + ')');
};


EqualityFilter.prototype.matches = function (target) {
  assert.object(target, 'target');

  var tv = helpers.getAttrCaseless(target, this.attribute);
  var value = this.value;

  return helpers.multiTest(function (v) {
    return value === v;
  }, tv);
};


///--- Exports

module.exports = EqualityFilter;
