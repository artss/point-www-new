/* global define */

define(['backbone'], function(Backbone) {
  'use strict';

  var UserModel = Backbone.Model.extend({
    initialize: function() {
      if (this.login) {
        this.url = '/u/' + this.login;
      }
    }
  });

  return UserModel;
});

