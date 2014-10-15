var assert = require('assert-plus');

var helpers = require('./helpers');


///--- API

function PresenceFilter(options) {
  if (typeof (options) === 'object') {
    assert.string(options.attribute, 'options.attribute');
    this.attribute = options.attribute;
  }


  var self = this;
  this.__defineGetter__('type', function () { return 'present'; });
  this.__defineGetter__('json', function () {
    return {
      type: 'PresenceMatch',
      attribute: self.attribute
    };
  });
}


PresenceFilter.prototype.toString = function () {
  return '(' + helpers.escape(this.attribute) + '=*)';
};


PresenceFilter.prototype.matches = function (target) {
  assert.object(target, 'target');

  return (helpers.getAttrCaseless(target, this.attribute) !== null);
};


///--- Exports

module.exports = PresenceFilter;
