/* global define */

define(['underscore', 'util/util', 'lib/promise'], function(_, util, Promise) {
  'use strict';

  var request = {
    /**
     * GET request
     */
    get: function(url, params) {
      if (_.isObject(params)) {
        params = _.map(params, function(value, key) {
          if (!_.isArray(value)) {
            value = [value];
          }

          return _.map(value, function(v) {
            return util.urlencode(key) + '=' + util.urlencode(v);
          }).join('&');
        }).join('&');
      }

      if (!_.isEmpty(params)) {
        url += (_.indexOf(url, '?') > -1 ? '&' : '?') + params;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      var promise = new Promise(function(resolve, reject) {
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 400) {
            resolve(xhr.responseText);
          } else {
            reject(xhr);
          }
        };

        xhr.onerror = reject;
        xhr.onabort = function() {
          reject(xhr, 'abort');
        };

        xhr.send();
      });

      promise.url = url;

      promise.cancel = function() {
        xhr.abort();
      };

      return promise;
    },

    /**
     * GET request returning JSON
     */
    getJSON: function(url, params) {
      var requestPromise = request.get(url, params);

      var promise = requestPromise.then(function(data) {
        return JSON.parse(data);
      });

      promise.url = requestPromise.url;
      promise.cancel = requestPromise.cancel;

      return promise;
    }
  };

  return request;
});

