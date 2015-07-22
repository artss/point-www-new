/* global define */

define(['underscore', 'util/util', 'lib/promise'], function(_, util, Promise) {
  'use strict';

  function request(method, url, params) {
    if (_.isObject(params)) {
      params = request.params(params);
    }

    if (method.toUpperCase() === 'GET') {
      if (params) {
        url += (url.indexOf('?') > -1 ? '&' : '?') + params;
      }
      params = null;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    var promise = new Promise(function(resolve, reject) {
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch(e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(xhr);
        }
      };

      xhr.onerror = reject;
      xhr.onabort = function() {
        reject();
      };

      xhr.send(params);
    });

    promise.url = url;

    promise.cancel = function() {
      xhr.abort();
    };

    return promise;
  }

  /**
   * Serialize params
   */
  request.params = function(params) {
    return _.map(params, function(value, key) {
      if (!_.isArray(value)) {
        value = [value];
      }

      return _.map(value, function(v) {
        return util.urlencode(key) + '=' + util.urlencode(v);
      }).join('&');
    }).join('&');
  };

  _.each(['GET', 'POST', 'UPDATE', 'DELETE'], function(method) {
    request[method.toLowerCase()] = function(url, params) {
      return request(method, url, params);
    };
  });

  return request;
});

