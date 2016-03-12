'use strict';

import _ from 'lodash';
import {FormModel, FormView} from 'lib/form';

class LoginModel extends FormModel {
    get url() { return '/login'; }

    get validation() {
        return {
            login: [ 'required', /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i ],
            password: [ 'required' ]
        };
    }
}

export default class LoginForm extends FormView {
    get Model() { return LoginModel; }

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

