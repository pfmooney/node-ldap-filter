// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2015 Patrick Mooney

var util = require('util');
var assert = require('assert-plus');

var helpers = require('./helpers');


///--- API

function NotFilter(options) {
  assert.optionalObject(options);
  options = options || {};
  assert.optionalObject(options.filter, 'options.filter');

  this.filter = options.filter || {};
}
util.inherits(NotFilter, helpers.Filter);
Object.defineProperties(NotFilter.prototype, {
  type: {
    get: function getType() { return 'not'; },
    configurable: false
  },
  json: {
    get: function getJson() {
      return {
        type: 'Not',
        filter: this.filter
      };
    },
    configurable: false
  }
});

NotFilter.prototype.addFilter = function addFilter(filter) {
  assert.object(filter, 'filter');
  this.filter = filter;
};

NotFilter.prototype.toString = function toString() {
  return '(!' + this.filter.toString() + ')';
};

NotFilter.prototype.matches = function matches(target, strictAttrCase) {
  return !this.filter.matches(target, strictAttrCase);
};


///--- Exports

module.exports = NotFilter;
