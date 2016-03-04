'use strict';

import _ from 'lodash';
import util from 'util/util';
import Promise from 'lib/promise';

function parseJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

export default function request(method, url, params, options) {
    if (_.isObject(params) && !(params instanceof FormData)) {
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

    if (_.isObject(options) && _.isObject(options.headers)) {
        _.each(options.headers, (value, key) => xhr.setRequestHeader(key, value));
    }

    var promise = new Promise((resolve, reject) => {
        function throwError() {
            reject(parseJson(this.responseText));
        }

        xhr.onload = () => {
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

    promise.cancel = () => xhr.abort();

    return promise;
}

/**
 * Serialize params
 */
request.params = (params) => {
    return params.map((value, key) => {
        if (!_.isArray(value)) {
            value = [value];
        }

        return value.map(v => util.urlencode(key) + '=' + util.urlencode(v)).join('&');
    }).join('&');
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => {
    request[method.toLowerCase()] = (url, params) => request(method, url, params);
});

