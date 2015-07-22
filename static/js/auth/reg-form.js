/* global define */

define(['lib/form', 'backbone', 'underscore', 'lib/request', 'lib/dom'], function(Form, Backbone, _, request, dom) {
  'use strict';

  var validators = {};

  _.each(['login', 'email'], function(name) {
    function validator(value) {
      if (validator.request) {
        validator.request.cancel();
      }

      value = value.trim();

      if (typeof validator.cache[value] === 'undefined') {
        validator.request = request.get('/check-' + name, { value: value });

        return validator.request.then(function(resp) {
          if (_.isObject(resp.data) && resp.data.error) {
            validator.cache[value] = true;
            throw resp.data.error;
          } else {
            validator.cache[value] = false;
            validator.request = undefined;
          }
        })
        .catch(function() {
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
  var RegModel = Form.Model.extend({
    validation: {
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
    }
  });

  /**
   * Registration form view.
   */
  var RegForm = Form.View.extend({
    model: RegModel,

    events: _.extend({}, Form.View.prototype.events, {
      'click .js-show-password': function(evt) {
        console.log(dom.closest(evt.target, '.js-input-container'));
        dom.closest(evt.target, '.js-input-container').classList.toggle('show-password');
      }
    }),

    render: function() {
      Form.View.prototype.render.call(this);

      var recaptcha = this.$('.recaptcha')[0];
      this.recaptcha = dom.select(recaptcha, '.g-recaptcha');

      var openRecaptcha = function () {
        recaptcha.classList.add('open');
        dom.off(this.el, 'focus', openRecaptcha);
      }.bind(this);
      dom.on(this.el, 'focus', 'input', openRecaptcha);

      window[this.recaptcha.getAttribute('data-callback')] = function() {
        this.setValue('g-recaptcha-response');
      }.bind(this);

      window[this.recaptcha.getAttribute('data-expired-callback')] = function() {
        this.getField('g-recaptcha-response').value = '';
        this.setValue('g-recaptcha-response');
      }.bind(this);
    },

    setValue: function(evt) {
      var field = Form.View.prototype.setValue.call(this, evt);

      if (field.getAttribute('name') !== 'password') {
        return;
      }

      var value = field.value;

      _.each(this.$('[name="password"]'), function(el) {
        el.value = value;
      });
    },

    submit: function(evt) {
      this.setValue('g-recaptcha-response');

      Form.View.prototype.submit.call(this, evt);
    },

    destroy: function() {
      delete window[this.recaptcha.getAttribute('data-callback')];
      delete window[this.recaptcha.getAttribute('data-expired-callback')];

      Form.View.prototype.destroy.apply(this, arguments);
    }
  });

  return RegForm;
});

