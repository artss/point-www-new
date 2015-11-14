/* global define */

define(function(require) {
  'use strict';

  var Backbone = require('backbone');
  var nativeajax = require('backbone.nativeajax');
  require('auth/login-register');

  Backbone.ajax = nativeajax;
});

