'use strict';

import BaseView from 'lib/base-view';
import {FormModel} from 'lib/form';

export class PostModel extends FormModel {
    get defaults() {
        return {
            tags: '',
            text: '',
            file: [],
            private: false
        };
    }

    get url() { return '/p'; }

    initialize() {
        super.initialize(arguments);
        console.log('PostModel', this, arguments);
    }

    get validation() {
        return {
            text: ['required']
        };
    }
}

export class PostView extends BaseView {
    get className() { return 'post-view'; }

    initialize(options) {
        super.initialize(options);
    }
}

