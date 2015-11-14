/* global define */

define(function(require) {
  'use strict';

  var Backbone = require('backbone');

  var UserModel = Backbone.Model.extend({
    initialize: function() {
      if (this.login) {
        this.url = '/u/' + this.login;
      }
    }
  });

  return UserModel;
});

