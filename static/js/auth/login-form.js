'use strict';

import _ from 'lodash';
import Form from 'lib/form';

class LoginModel extends Form.Model {
    // FIXME: url
    // url: '/login',

    // FIXME: validation
    /*validation: {
        login: [
            'required',
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i
        ],
        password: [
            'required'
        ]
    }*/
}

export default class LoginForm extends Form.View {
    // FIXME: model
    //model: LoginModel,

    initialize(options) {
        super.initialize(options);

        this.on('error', data => {
            _.each(data.errors, (message, field) => {
                this.setValidation(field, false, message);
                this.focus('password');
            }, this);
        });
    }
}

