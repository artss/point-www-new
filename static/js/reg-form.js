define(['form', 'backbone', 'underscore', 'jquery'], function(Form, Backbone, _, $) {
  var loginXhr;
  var logins = {};

  function loginInUse(value) {
    if (loginXhr) {
      loginXhr.abort();
    }

    value = $.trim(value);

    if (typeof logins[value] === 'undefined') {
      var dfd = $.Deferred();

      loginXhr = $.ajax({
        url: '/check-login',
        data: { login: value }
      })
      .always(function() {
        loginXhr = undefined;
      })
      .success(function(data) {
        if (_.isObject(data.data) && data.data.error) {
          console.log('error', data.data.error);
          logins[value] = true;
          dfd.reject(data.data.error);
        } else {
          logins[value] = false;
          dfd.resolve();
        }
      });

      return dfd.promise();

    } else {
      console.log('logins', logins);
      return logins[value] ? 'inuse' : undefined;
    }
  }

  /**
   * Registration form model.
   */
  var RegModel = Form.Model.extend({
    validation: {
      login: [
        'required',
        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i,
        loginInUse
      ],
      password: [
        'required',
        /^.{6,}/
      ],
      email: [
        'required',
        'email'
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

    render: function() {
      Form.View.prototype.render.call(this);

      var $recaptcha = this.$('.recaptcha');

      var $inputs = this.$(':input');
      $inputs.on('focus.render', function () {
        $recaptcha.addClass('open');
        $inputs.off('focus.render');
      });
    },

    submit: function() {
      this.model.validate('g-recaptcha-response');

      Form.View.prototype.submit.apply(this, arguments);
    }
  });

  return RegForm;
});

