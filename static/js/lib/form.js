'use strict';

import _ from 'lodash';
import BaseModel from 'lib/base-model';
import BaseView from 'lib/base-view';
import dom from 'lib/dom';
import request from 'lib/request';
import autosize from 'util/autosize';

/**
 * RegExp validators generator.
 *
 * @param {string} name Validator name.
 * @param {RegExp} re Regular expression.
 *
 * @return {function} Validator function
 */
function matchFn(name, re) {
    return value => {
        if (!value) {
            return;
        }
        return re.test(value) ? undefined : name;
    };
}

/**
 * Base form model.
 */
export class FormModel extends BaseModel {
    get validation() { return {}; }

    validate(fields) {
        if (_.isEmpty(fields)) {
            fields = this.attributes;
        }

        if (!this._valid) {
            this._valid = {};
        }

        _.each(fields, (value, field) => {
            this._valid[field] = false;

            if (!_.isArray(this.validation[field])) {
                this._valid[field] = true;
                return;
            }

            var validators = this.validation[field].slice();

            var chain = () => {
                if (_.isEmpty(validators)) {
                    // validation done; all is correct
                    this._valid[field] = true;
                    this.trigger('validated', field, true);
                    return;
                }

                var validator = validators.shift();

                if (_.isString(validator)) {
                    validator = FormModel.validators[validator];
                } else if (_.isRegExp(validator)) {
                    validator = matchFn('match', validator);
                }

                if (_.isFunction(validator)) {
                    var res = validator.call(this, value);

                    if (res && res.then) { // Promise
                        res.then(chain);
                        res.catch(message => this.trigger('validated', field, false, message));
                    } else if (res) {
                        this.trigger('validated', field, false, res);
                    } else {
                        chain();
                    }
                }
            };

            chain();
        }, this);
    }

    isValid() {
        if (typeof this._valid === 'undefined') {
            this.validate();
        }

        return !_.some(_.values(this._valid), v => !v);
    }

    save() {
        var formData = new FormData();

        _.each(this.toJSON(), (value, key) => {
            if (_.isArray(value) || value instanceof FileList) {
                _.each(value, val => formData.append(key, val));
            } else {
                formData.append(key, value);
            }
        });

        var method, url;

        if (this.id) {
            method = 'PUT';
            url = this.url + '/' + this.id;
        } else {
            method = 'POST';
            url = this.url;
        }

        return request(method, url, formData);
    }
}

FormModel.validators = {
    required: function (value) {
        if (!value) {
            return 'required';
        }
    },

    integer: matchFn('integer', /^\d+$/),
    email: matchFn('email', /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),
    url: matchFn('url', /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i)
};

/**
 * Base form view.
 */
export class FormView extends BaseView {
    /**
     * Form model class
     */
    get Model() { return FormModel; }

    /**
     * Form model instance
     */
    get model() { return this._model; }
    set model(model) { this._model = model; }

    get events() {
        return {
            'submit': 'submit',
            'change': 'setValue',
            'input input': 'setValueDelayed'
        };
    }

    constructor(options) {
        super(options);

        if (!options.model) {
            /* eslint-disable new-cap */
            this.model = new this.Model();
            /* eslint-enable new-cap */
        }

        this.listenTo(this.model, {
            'validated': this.setValidation
        });

        if (options.el) {
            this.render();
        }
    }

    render() {
        this.model.set(_.reduce(this.el.elements, (memo, f) => {
            if (f.name) {
                memo[f.name] = f.value;
            }
            return memo;
        }, {}));
        this.submitButton = this.$('.js-submit')[0];

        autosize(this.$('.js-autosize'));
    }

    /**
     * Sets focus to the passed field.
     *
     * @param {string|HTMLElement} field Field name or element.
     */
    focus(field) {
        if (_.isString(field)) {
            field = this.getField(field);
        }
        field.focus();
    }

    /**
     * Returns form field by name.
     *
     * @param {string} name Field name.
     */
    getField(name) {
        return this.$('[name="' + name + '"]')[0];
    }

    /**
     * Updates value in model.
     *
     * @param {string|event} evt Field name or event object.
     *
     * @returns {HTMLElement} Field element.
     */
    setValue(evt) {
        //window._m = this;
        var field = _.isString(evt) ? this.getField(evt) : evt.target;

        var obj = {};
        obj[field.getAttribute('name')] = field.files ? field.files : field.value;

        this.model.set(obj);
        this.model.validate(obj);

        return field;
    }

    /**
     * Debounced setValue
     */
    get setValueDelayed() {
        return _.debounce((evt) => this.setValue(evt), 400);
    }

    /**
     * Updates submit button status.
     *
     * @param {bool} valid Status.
     */
    updateButton(valid) {
        if (!this.submitButton || this.submitButton.classList.contains('loading')) {
            return;
        }

        if (typeof valid === 'undefined') {
            valid = this.model.isValid();
        }
        this.submitButton.disabled = !valid;
    }

    /**
     * Sets field valid|invalid.
     *
     * @param {string|HTMLElement} field Field name or element.
     * @param {bool} valid Status.
     * @param {string} [message] Error desciption.
     */
    setValidation(field, valid, message) {
        if (_.isString(field)) {
            field = this.getField(field);
        }
        var container = dom.closest(field, '.js-input-container');
        if (!container) {
            container = field;
        }

        if (!valid) {
            var errdata = field.getAttribute('data-error');
            try {
                errdata = JSON.parse(errdata);
            } catch (e) {}
            var error;

            if (message) {
                error = _.isObject(errdata) ? errdata[message] || message : message;
            }

            if (!error) {
                error = _.isObject(errdata) ? errdata['default'] : errdata;
            }

            var label = dom.select(container, '.js-input-error-label');

            if (label) {
                label.innerHTML = error;
            }

            field.focus();
        }

        if (valid) {
            container.classList.remove('error');
        } else {
            container.classList.add('error');
        }

        this.updateButton();
    }

    /**
     * Submits form.
     */
    submit(evt) {
        if (evt) {
            evt.preventDefault();
        }

        this.model.validate();
        if (!this.model.isValid()) {
            return;
        }

        _.each(this.el.elements, el => { el.disabled = true; });
        this.submitButton.classList.add('loading');

        /*request(
          (this.el.method || 'GET').toUpperCase(),
          this.el.action,
          this.model.toJSON()
        )*/
        this.model.save()
            .then(data => this.trigger('success', data.data))

        .catch(xhr => {
            var data = xhr.responseJSON && xhr.responseJSON.data ? xhr.responseJSON.data : xhr.data;
            this.trigger('error', data);
        });

        /*.always(function() {
          this.$(':input').prop('disabled', false);
          this.$submitButton.removeClass('loading');
        }.bind(this))*/
    }

    destroy() {
        this.stopListening(this.model);
        this.model.destroy();
        delete this.model;

        super.destroy();
    }
}

