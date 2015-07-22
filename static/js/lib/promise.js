/* global define */

define(['/bower_components/promise-polyfill/Promise.js'], function() {
  'use strict';

  console.log('- promise', Promise.toString());

  return window.Promise;
});

