/* global define */

define(['backbone', 'backbone.nativeajax', 'auth/login-register'], function (Backbone, nativeajax) {
  'use strict';

  Backbone.ajax = nativeajax;
});

