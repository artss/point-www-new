'use strict';

import Backbone from 'backbone';
import _ from 'lodash';
import {PostModel} from 'post';
import {FormView} from 'lib/form';

export default class PostFormView extends FormView {
    get Model() { return PostModel; }

    get events() {
        if (this._events) { return this._events; }

        this._events = _.extend({}, super.events, {
            'input textarea': 'setValueDelayed',
            'click .btn-cancel': 'cancel',
            'change .js-file': 'updateUploads',
            'keyup textarea': 'handleHotkeys'
        });

        return this._events;
    }

    cancel() {
        Backbone.trigger('new-post-cancel');
    }

    handleHotkeys(evt) {
        switch (evt.keyCode) {
            case 13:
                if (evt.ctrlKey) { this.submit(); }
                break;

            case 27:
                this.cancel();
                break;
        }
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

