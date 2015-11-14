/* global define */

define(function(require) {
  'use strict';

  var Backbone = require('backbone');
  var BaseView = require('lib/base-view');

  var PostModel = Backbone.Model.extend({});

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

