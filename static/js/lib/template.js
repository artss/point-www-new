'use strict';

import _ from 'lodash';
import twig from 'twig';
import util from 'util/util';
import strftime from 'strftime';

import templates from '../.templates.js';

const filters = {
    userlink: util.userlink,

    markdown: text => text,

    urlencode: util.urlencode,

    urldecode: util.urldecode,

    strftime: (date, format) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (format instanceof Array) {
            format = format[0];
        }

        return strftime(format, date);
    },

    safe: (str) => str + '',

    json: (obj) => JSON.stringify(obj)
};

_.each(filters, (fn, name) => twig.extendFilter(name, fn));

twig.extend(function (Twig) {
    Twig.Templates.load_orig = Twig.Templates.load;

    Twig.Templates.load = function (file) {
        file = file.replace(/^\//, '');

        if (file === 'base.html') {
            file = '_base.html';
        }

        return Twig.Templates.load_orig.call(this, file);
    };
});

export default (name, data) => templates[name.replace(/^\//, '')].render(_.extend({settings: window.settings, env: window.env}, data));

