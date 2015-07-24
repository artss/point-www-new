/* global define */

define(['backbone', 'lib/base-view'], function(Backbone, BaseView) {
  'use strict';

  var PostModel = Backbone.Model.extend({});

  var PostView = BaseView.extend({});

  return {
    Model: PostModel,
    View: PostView
  };
});

