/* global require */

require.config({
  baseUrl: '/js',

  shim: {
    'lib/jquery.autosize': {
      deps: ['jquery']
    },
  },

  paths: {
    'jquery': 'lib/jquery',
    'backbone': '../bower_components/backbone/backbone',
    'backbone.nativeview': '../bower_components/backbone.nativeview/backbone.nativeview',
    'underscore': '../bower_components/underscore/underscore',
    //'promise': '../bower_components/promise-polyfill/Promise',
    'text': 'lib/require.text',
    'swig': '../bower_components/swig/dist/swig',
    'tpl': 'lib/tpl/tpl',
    'strftime': '../bower_components/strftime/strftime'
  },

  tplPath: '/templates'
});
