/* global define */

define(['util/util', 'lib/strftime'], function(util) {
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
      return date.strftime(format);
    }
  };
});

