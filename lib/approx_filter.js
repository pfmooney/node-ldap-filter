var assert = require('assert-plus');

var helpers = require('./helpers');



///--- API

function ApproximateFilter(options) {
  if (typeof (options) === 'object') {
    assert.string(options.attribute, 'options.attribute');
    assert.string(options.value, 'options.value');
    this.attribute = options.attribute;
    this.value = options.value;
  }

  var self = this;
  this.__defineGetter__('type', function () { return 'approx'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'ApproximateMatch',
      attribute: self.attribute,
      value: self.value,
    };
  });
}


ApproximateFilter.prototype.toString = function () {
  return ('(' + helpers.escape(this.attribute) +
          '~=' + helpers.escape(this.value) + ')');
};


ApproximateFilter.prototype.matches = function (target) {
  // Consumers must implement this themselves
  throw new Error('approx match implementation missing');
};


///--- Exports

module.exports = ApproximateFilter;
