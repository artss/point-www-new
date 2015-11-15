define(function(require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var Post = require('post');
  var Form = require('lib/form');

  var PostFormView = Form.View.extend({
    model: Post.Model,

    events: _.extend({}, Form.View.prototype.events, {
      'input textarea': 'setValueDelayed',
      'click .btn-cancel': 'cancel',
      'change .js-file': 'updateUploads'
    }),

    cancel: function() {
      Backbone.trigger('new-post-cancel');
    },

    updateUploads: function (evt) {
      var upload = this.$('.upload')[0];
      var number = this.$('.upload .number')[0];

      var files = evt.target.files;

      if (files.length > 0) {
        upload.classList.add('positive');
      } else {
        upload.classList.remove();
      }

      number.innerHTML = files.length;
    }
  });

  return PostFormView;
});

