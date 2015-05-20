define(['form', 'backbone', 'underscore', 'jquery'], function(Form, Backbone, _, $) {
  var loginXhr, emailXhr;
  var logins = {}, emails = {};

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
          logins[value] = true;
          dfd.reject(data.data.error);
        } else {
          logins[value] = false;
          dfd.resolve();
        }
      });

      return dfd.promise();

    } else {
      return logins[value] ? 'inuse' : undefined;
    }
  }

  function emailInUse(value) {
    if (loginXhr) {
      emailXhr.abort();
    }

    value = $.trim(value);

    if (typeof emails[value] === 'undefined') {
      var dfd = $.Deferred();

      loginXhr = $.ajax({
        url: '/check-email',
        data: { email: value }
      })
      .always(function() {
        loginXhr = undefined;
      })
      .success(function(data) {
        if (_.isObject(data.data) && data.data.error) {
          emails[value] = true;
          dfd.reject(data.data.error);
        } else {
          emails[value] = false;
          dfd.resolve();
        }
      });

      return dfd.promise();

    } else {
      return emails[value] ? 'inuse' : undefined;
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
        'email',
        emailInUse
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
        $(evt.target).closest('.js-input-container').toggleClass('show-password');
      }
    }),

    render: function() {
      Form.View.prototype.render.call(this);

      var $recaptcha = this.$('.recaptcha');
      this.$recaptcha = $recaptcha.find('.g-recaptcha');

      var $inputs = this.$(':input');
      $inputs.on('focus.render', function () {
        $recaptcha.addClass('open');
        $inputs.off('focus.render');
      }.bind(this));

      window[this.$recaptcha.data('callback')] = function() {
        console.log('callback', this.$el.data('callback'));
        this.setValue('g-recaptcha-response');
      }.bind(this);

      window[this.$recaptcha.data('expired-callback')] = function() {
        console.log('expired', this.$recaptcha.data('expired-callback'));
        this.getField('g-recaptcha-response').val('');
        this.setValue('g-recaptcha-response');
      }.bind(this);
    },

    setValue: function(evt) {
      var $field = Form.View.prototype.setValue.call(this, evt);

      if ($field.attr('name') !== 'password') {
        return;
      }

      var value = $field.val();

      this.$('[name="password"]').each(function() {
        $(this).val(value);
      });
    },

    submit: function(evt) {
      this.setValue('g-recaptcha-response');

      Form.View.prototype.submit.call(this, evt);
    },

    destroy: function() {
      delete window[this.$recaptcha.data('callback')];
      delete window[this.$recaptcha.data('expired-callback')];

      Form.View.prototype.destroy.apply(this, arguments);
    }
  });

  return RegForm;
});

