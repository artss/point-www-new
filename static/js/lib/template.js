'use strict';

import _ from 'lodash';
import Twig from 'twig';
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
        return strftime(format, date);
    },

    length: obj => obj.length
};

_.each(filters, (fn, name) => Twig.extendFilter(name, fn));

Twig.extend(function (twig) {
    twig.Template.prototype.importFile_orig = twig.Template.prototype.importFile;

    twig.Template.prototype.importFile = function (file) {
        file = file.replace(/^\//, '');
        console.log('importFile', file);
        return this.importFile_orig(file);
    };

    twig.Template.prototype.render_orig = twig.Template.prototype.render;

    twig.Template.prototype.render = function () {
        if (this.extend) {
            this.extend = this.extend.replace(/^\//, '');
        }

        return this.render_orig.apply(this, arguments);
    };
});

export default name => templates[name.replace(/^\//, '')];

