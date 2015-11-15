define(function(require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var Form = require('lib/form');

  var PostFormModel = Form.Model.extend({
    url: '/p',

    validation: {
      text: [
        function(value) {
          // TODO: validate model
          console.log('PostFormModel.validation', this, arguments, value);
          return 'text';
        }
      ]
    }
  });

  var PostFormView = Form.View.extend({
    events: _.extend({}, Form.View.prototype.events, {
      'click .btn-cancel': 'cancel'
    }),

    cancel: function() {
      Backbone.trigger('new-post-cancel');
    }
  });

  return {
    Model: PostFormModel,
    View: PostFormView
  };
});

