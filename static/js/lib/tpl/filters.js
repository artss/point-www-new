'use strict';

import util from 'util/util';
import strftime from 'strftime';

export default {
    userlink: util.userlink,

    markdown: text => text,

    urlencode: util.urlencode,

    urldecode: util.urldecode,

    strftime: (date, format) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return strftime(format, date);
    },

    length: obj => obj.length
};

