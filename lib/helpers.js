// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

///--- API

/**
 * RFC 2254 Escaping of filter strings
 *
 * Raw                     Escaped
 * (o=Parens (R Us))       (o=Parens \28R Us\29)
 * (cn=star*)              (cn=star\2A)
 * (filename=C:\MyFile)    (filename=C:\5cMyFile)
 *
 * Use substr_filter to avoid having * ecsaped.
 *
 * @author [Austin King](https://github.com/ozten)
 */
function _escape(inp) {
  if (typeof (inp) === 'string') {
    var esc = '';
    for (var i = 0; i < inp.length; i++) {
      switch (inp[i]) {
        case '*':
          esc += '\\2a';
          break;
        case '(':
          esc += '\\28';
          break;
        case ')':
          esc += '\\29';
          break;
        case '\\':
          esc += '\\5c';
          break;
        case '\0':
          esc += '\\00';
          break;
        default:
          esc += inp[i];
          break;
      }
    }
    return esc;

  } else {
    return inp;
  }
}

/**
 * Test a rule against one or more values.
 */
function multiTest(rule, value) {
  if (Array.isArray(value)) {
    var response = false;
    for (var i = 0; i < value.length; i++) {
      if (rule(value[i])) {
        response = true;
        break;
      }
    }
    return response;
  } else {
    return rule(value);
  }
}

/**
 * Search object for attribute, insensitive to case
 */
function getAttrCaseless(target, attr) {
  // Check for exact case match first
  if (target.hasOwnProperty(attr)) {
    return target[attr];
  }
  // Perform case-insensitive enumeration after that
  var lower = attr.toLowerCase();
  var result = null;
  Object.getOwnPropertyNames(target).some(function (item) {
    if (item.toLowerCase() == lower) {
      result = target[item];
      return true;
    }
    return false;
  });
  return result;
}


///--- Exports

module.exports = {
  escape: _escape,
  multiTest: multiTest,
  getAttrCaseless: getAttrCaseless,
};
