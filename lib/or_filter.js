// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var assert = require('assert-plus');


///--- API

function OrFilter(options) {
  if (typeof (options) === 'object') {
    assert.arrayOfObject(options.filters, 'options.filters');
  } else {
    options = {};
  }

  this.filters = options.filters ? options.filters.slice() : [];

  var self = this;
  this.__defineGetter__('type', function () { return 'or'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'Or',
      filters: self.filters
    };
  });
}


OrFilter.prototype.toString = function () {
  var str = '(|';
  this.filters.forEach(function (f) {
    str += f.toString();
  });
  str += ')';

  return str;
};


OrFilter.prototype.matches = function (target) {
  assert.object(target, 'target');

  for (var i = 0; i < this.filters.length; i++) {
    if (this.filters[i].matches(target))
      return true;
  }

  return false;
};


OrFilter.prototype.addFilter = function (filter) {
  assert.object(filter, 'filter');

  this.filters.push(filter);
};


///--- Exports

module.exports = OrFilter;
