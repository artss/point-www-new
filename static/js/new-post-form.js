'use strict';

import Backbone from 'backbone';
import _ from 'lodash';
import dom from 'lib/dom';
import {PostModel} from 'post';
import {FormView} from 'lib/form';

const mainDiv = dom.select('.js-main');

export default class NewPostFormView extends FormView {
    get Model() { return PostModel; }

    events() {
        return _.extend({}, super.events, {
            'input textarea': 'setValueDelayed',
            'click .btn-cancel': 'cancel',
            'change .js-file': 'updateUploads',
            'keyup textarea': 'handleHotkeys'
        });
    }

    show() {
        mainDiv.classList.add('newpost');
        this.focus('text');
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

