/* global define, strftime */

define(function(require) {
  'use strict';

  var util = require('util/util');
  require('strftime');

  return {
    userlink: util.userlink,

    markdown: function(text) {
      return text;
    },

    urlencode: util.urlencode,

    urldecode: util.urldecode,

    strftime: function(date, format) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return strftime(format, date);
    },

    length: function(obj) {
      return obj.length;
    }
  };
});

