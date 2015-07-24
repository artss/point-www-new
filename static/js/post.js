/* global define */

define(['backbone', 'lib/base-view'], function(Backbone, BaseView) {
  'use strict';

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

