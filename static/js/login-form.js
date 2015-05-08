define(['form'], function(Form) {
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
    model: LoginModel
  });

  return LoginForm;
});

