'use strict';

import BaseView from 'lib/base-view';
import Form from 'lib/form';

export class PostModel extends Form.Model {
    // FIXME: defaults
    /*defaults: {
        tags: '',
        text: '',
        file: [],
        private: false
    },*/

    // FIXME: url
    /*url: '/p',*/

    initialize() {
        super.initialize(arguments);
        console.log('PostModel', this, arguments);
    }

    // FIXME: validation
    /*validation: {
        text: [
            'required'
        ]
    }*/
}

export class PostView extends BaseView {
    // FIXME: className
    //className: 'post-view',

    initialize(options) {
        super.initialize(options);
    }
}

