define(['form', 'backbone', 'underscore', 'jquery'], function(Form, Backbone, _, $) {
  var loginXhr;

  _.extend(Backbone.Validation.validators, {
    loginInUse: function(value, attrs, customValue, model) {
      return 'dfv';
    }
  });

  var RegModel = Form.Model.extend({
    validation: {
      login: {
        required: true,
        pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i,
        loginInUse: true
      },
      password: {
        required: true,
        minLength: 6
      },
      email: {
        required: true,
        pattern: 'email'
      },
      'g-recaptcha-response': {
        required: true
      }
    }
  });
  var RegForm = Form.View.extend({
    model: RegModel,

    render: function() {
      Form.View.prototype.render.call(this);

      var self = this;

      var $recaptcha = this.$('.recaptcha');

      var $inputs = this.$(':input');
      $inputs.on('focus.render', function () {
        $recaptcha.addClass('open');
        $inputs.off('focus.render');
        setInterval(function() {
          self.validateField('g-recaptcha-response');
        }, 500);
      });
    },

    validateField: function(evt) {
      Form.View.prototype.validateField.call(this, evt);

      var $field = _.isString(evt) ? this.$('[name="' + evt + '"]') : $(evt.target);
      var name = $field.attr('name');

      if (!this.isValid(name)) {
        return;
      }

      if (name !== 'login') {
        return;
      }

      if (loginXhr) {
        loginXhr.abort();
      }

      var self = this;

      loginXhr = $.ajax({
        url: '/check-login',
        data: { login: $field.val() }
      })
      .always(function() {
        loginXhr = undefined;
      })
      .success(function(data) {
        if (_.isObject(data.data) && _.isArray(data.data.errors)) {
          _.each(data.data.errors, function(error) {
            console.log('error');
            self.setValidation('login', false, error);
          });
        }
      });
    },

    updateValidation: function() {
      if (this.$('.recaptcha').hasClass('open')) {
        Form.View.prototype.updateValidation.call(this);
      }
    }
  });

  return RegForm;
});

