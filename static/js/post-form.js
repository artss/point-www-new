'use strict';

import Backbone from 'backbone';
//import _ from 'lodash';
//import {PostModel, PostView} from 'post';
import Form from 'lib/form';

export default class PostFormView extends Form.View {
    // FIXME: model
    //model: Post.Model,

    // FIXME: events
    /*events: _.extend({}, Form.View.prototype.events, {
        'input textarea': 'setValueDelayed',
        'click .btn-cancel': 'cancel',
        'change .js-file': 'updateUploads'
    }),*/

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

