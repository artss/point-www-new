define(['form', 'underscore'], function(Form, _) {
  var LoginModel = Form.Model.extend({
    validation: {
      login: {
        required: true,
        pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i
      },
      password: {
        required: true
      }
    }
  });
  var LoginForm = Form.View.extend({
    model: LoginModel,

    initialize: function(options) {
      Form.View.prototype.initialize.call(this, options);

      this.on('error', function(data) {
        if (_.isArray(data.errors) && _.indexOf(data.errors, 'credentials') > -1) {
          this.setValidation('password', false, 'Invalid login or password');
          this.focus('password');
        }
      });
    }
  });

  return LoginForm;
});

