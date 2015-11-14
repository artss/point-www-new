define(function(require) {
  'use strict';

  var _ = require('underscore');
  var Form = require('lib/form');

  var LoginModel = Form.Model.extend({
    url: '/login',

    validation: {
      login: [
        'required',
        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i
      ],
      password: [
        'required'
      ]
    }
  });
  var LoginForm = Form.View.extend({
    model: LoginModel,

    initialize: function(options) {
      Form.View.prototype.initialize.call(this, options);

      this.on('error', function(data) {
        _.each(data.errors, function(message, field) {
          this.setValidation(field, false, message);
          this.focus('password');
        }, this);
      });
    }
  });

  return LoginForm;
});

