/* global define */

define(['underscore'], function(_) {
  'use strict';

  return {
    userlink: function(user, path) {
      if (_.isObject(user)) {
        user = user.login;
      }
      return ['/u', user, path].join('/').replace(/\/{2,}/, '/');
    },

    parseUrl: function parseUrl(url) {
      var a = document.createElement('a');
      a.href = url;

      return _.pick(a, ['href', 'protocol', 'host', 'hostname', 'port',
                        'pathname', 'search', 'hash']);
    }
  };
});

