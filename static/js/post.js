'use strict';

import TemplatedView from 'lib/templated-view';
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

    initialize(attributes, options) {
        super.initialize(attributes, options);
    }

    get validation() {
        return {
            text: ['required']
        };
    }
}

export class PostView extends TemplatedView {
    get className() { return 'post-view'; }

    initialize(options) {
        super.initialize(options);
    }
}
