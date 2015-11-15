define(function(require) {
  'use strict';

  var BaseView = require('lib/base-view');
  var Form = require('lib/form');

  var PostModel = Form.Model.extend({
    defaults: {
      tags: '',
      text: '',
      file: [],
      private: false
    },

    url: '/p',

    initialize: function() {
      Form.Model.prototype.initialize.apply(this, arguments);
      console.log('PostModel', this, arguments);
    },

    validation: {
      text: [
        'required'
      ]
    }
  });

  var PostView = BaseView.extend({
    className: 'post-view',

    initialize: function(options) {
      BaseView.prototype.initialize.call(this, options);
    }
  });

  return {
    Model: PostModel,
    View: PostView
  };
});

