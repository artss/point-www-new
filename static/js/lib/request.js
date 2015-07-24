/* global define */

define(['underscore', 'util/util', 'lib/promise'], function(_, util, Promise) {
  'use strict';

  function parseJson(data) {
    try {
      return JSON.parse(data);
    } catch(e) {
      return data;
    }
  }

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
      function throwError() {
        reject(parseJson(this.responseText));
      }

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(parseJson(xhr.responseText));
        } else {
          throwError.call(xhr, xhr.status);
        }
      };

      xhr.onerror = throwError.bind(xhr);
      xhr.onabort = throwError.bind(xhr);

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

