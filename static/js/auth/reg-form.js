'use strict';

import _ from 'lodash';
import {FormModel, FormView} from 'lib/form';
import dom from 'lib/dom';
import request from 'lib/request';

var validators = {};

_.each(['login', 'email'], function (name) {
    function validator(value) {
        if (validator.request) {
            validator.request.cancel();
        }

        value = value.trim();

        if (typeof validator.cache[value] === 'undefined') {
            validator.request = request.get('/check-' + name, {
                value: value
            });

            return validator.request.then(resp => {
                if (_.isObject(resp.data) && resp.data.error) {
                    validator.cache[value] = true;
                    throw resp.data.error;
                } else {
                    validator.cache[value] = false;
                    validator.request = undefined;
                }
            })
            .catch(function () {
                validator.request = undefined;
            });
        } else {
            return validator.cache[value] ? 'inuse' : undefined;
        }
    }

    validator.cache = {};
    validators[name] = validator;
});

/**
 * Registration form model.
 */
class RegModel extends FormModel {
    get url() { return '/register'; }

    get validation() {
        return {
            login: [
                'required',
                /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i,
                validators.login
            ],
            password: [
                'required',
                /^.{6,}/
            ],
            email: [
                'required',
                'email',
                validators.email
            ],
            'g-recaptcha-response': [
                'required'
            ]
        };
    }
}

/**
 * Registration form view.
 */
export default class RegForm extends FormView {
    get model() { return RegModel; }

    get events() {
        if (this._events) { return this._events; }

        this._events = _.extend({}, super.events, {
            'click .js-show-password': evt => {
                dom.closest(evt.target, '.js-input-container').classList.toggle('show-password');
            }
        });
    }

    render() {
        //Form.View.prototype.render.call(this);
        super.render();

        window._m = this.model;

        var recaptcha = this.$('.recaptcha')[0];
        this.recaptcha = dom.select(recaptcha, '.g-recaptcha');

        var openRecaptcha = function () {
            recaptcha.classList.add('open');
            dom.off(this.el, 'focus', openRecaptcha);
        }.bind(this);
        dom.on(this.el, 'focus', 'input', openRecaptcha);

        window[this.recaptcha.getAttribute('data-callback')] = () => this.setValue('g-recaptcha-response');

        window[this.recaptcha.getAttribute('data-expired-callback')] = () => {
            this.getField('g-recaptcha-response').value = '';
            this.setValue('g-recaptcha-response');
        };
    }

    setValue(evt) {
        //var field = Form.View.prototype.setValue.call(this, evt);
        var field = super.setValue(evt);

        if (field.getAttribute('name') !== 'password') {
            return;
        }

        var value = field.value;

        _.each(this.$('[name="password"]'), el => { el.value = value; });
    }

    submit(evt) {
        this.setValue('g-recaptcha-response');

        //Form.View.prototype.submit.call(this, evt);
        super.submit(evt);
    }

    destroy() {
        delete window[this.recaptcha.getAttribute('data-callback')];
        delete window[this.recaptcha.getAttribute('data-expired-callback')];

        //Form.View.prototype.destroy.apply(this, arguments);
        super.destroy();
    }
}

