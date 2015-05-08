define(['form'], function(Form) {
  var RegModel = Form.Model.extend({
    validation: {
      login: {
        required: true,
        pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i
      },
      password: {
        required: true,
        minLength: 6
      },
      email: {
        required: true,
        pattern: 'email'
      }
    }
  });
  var RegForm = Form.View.extend({
    model: RegModel,

    render: function() {
      Form.View.prototype.render.call(this);

      var $recaptcha = this.$('.recaptcha');

      var $inputs = this.$('input');
      $inputs.on('focus.render', function () {
        $recaptcha.addClass('open');
        $inputs.off('focus.render');
      });
    }
  });

  return RegForm;
});

