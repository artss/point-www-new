'use strict';

import Backbone from 'backbone';
import _ from 'lodash';
import {PostModel} from 'post';
import {FormView} from 'lib/form';

export default class PostFormView extends FormView {
    get model() { return PostModel; }

    get events() {
        if (this._events) { return this._events; }

        this._events = _.extend({}, super.events, {
            'input textarea': 'setValueDelayed',
            'click .btn-cancel': 'cancel',
            'change .js-file': 'updateUploads'
        });
    }

    cancel() {
        Backbone.trigger('new-post-cancel');
    }

    updateUploads(evt) {
        var upload = this.$('.upload')[0];
        var number = this.$('.upload .number')[0];

        var files = evt.target.files;

        if (files.length > 0) {
            upload.classList.add('positive');
        } else {
            upload.classList.remove();
        }

        number.innerHTML = files.length;
    }
}

