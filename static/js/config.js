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
    'underscore': '../bower_components/underscore/underscore',
    'text': 'lib/require.text',
    //'swig': 'lib/swig',
    'swig': '../bower_components/swig/dist/swig',
    'tpl': 'lib/tpl/tpl',
    'strftime': '../bower_components/strftime/strftime'
  },

  tplPath: '/templates'
});
