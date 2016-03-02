'use strict';

import Backbone from 'backbone';

export default class UserModel extends Backbone.Model {
    initialize() {
        if (this.login) {
            this.url = '/u/' + this.login;
        }
    }
}

