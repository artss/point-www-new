/* global define, strftime */

define(['util/util', 'strftime'], function(util) {
  'use strict';

  return {
    userlink: util.userlink,

    markdown: function(text) {
      return text;
    },

    urlencode: function(text) {
      return encodeURIComponent(text);
    },

    urldecode: function(text) {
      return decodeURIComponent(text);
    },

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
