'use strict';

import _ from 'lodash';

const util = {
    userlink: function (user, path) {
        if (_.isObject(user)) {
            user = user.login;
        }
        return ['/u', user, path].join('/').replace(/\/{2,}/, '/');
    },

    urlencode: function (text) {
        return encodeURIComponent(text);
    },

    urldecode: function (text) {
        return decodeURIComponent(text);
    },

    parseUrl: function parseUrl(url) {
        var a = document.createElement('a');
        a.href = url;

        return _.pick(a, ['href', 'protocol', 'host', 'hostname', 'port',
            'pathname', 'search', 'hash'
        ]);
    }
};

export default util;

