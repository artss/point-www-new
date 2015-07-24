/* global require, settings */

require.config({
  baseUrl: '/js',

  urlArgs: (settings && settings.debug) ? 'bust=' + (new Date()).getTime() : '',

  shim: {
    /*'lib/jquery.autosize': {
      deps: ['jquery']
    }*/
  },

  paths: {
    'jquery': 'lib/jquery-dummy',
    'backbone': '../bower_components/backbone/backbone',
    'backbone.nativeview': '../bower_components/backbone.nativeview/backbone.nativeview',
    'backbone.nativeajax': '../bower_components/backbone.nativeajax/backbone.nativeajax',
    'underscore': '../bower_components/underscore/underscore',
    //'promise': '../bower_components/promise-polyfill/Promise',
    'text': 'lib/require.text',
    'swig': '../bower_components/swig/dist/swig',
    'tpl': 'lib/tpl/tpl',
    'strftime': '../bower_components/strftime/strftime'
  },

  tplPath: '/templates'
});
