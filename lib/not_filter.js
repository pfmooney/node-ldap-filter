var assert = require('assert-plus');


///--- API

function NotFilter(options) {
  if (typeof (options) === 'object') {
    assert.object(options.filter, 'options.filter');
  } else {
    options = {};
  }

  this.filter = options.filter || {};

  var self = this;
  this.__defineGetter__('type', function () { return 'not'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'Not',
      filter: self.filter
    };
  });
}


NotFilter.prototype.addFilter = function (filter) {
  assert.object(filter, 'filter');
  this.filter = filter;
};


NotFilter.prototype.toString = function () {
  return '(!' + this.filter.toString() + ')';
};


NotFilter.prototype.matches = function (target) {
  return !this.filter.matches(target);
};


///--- Exports

module.exports = NotFilter;
