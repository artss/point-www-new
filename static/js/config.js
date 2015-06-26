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
    'backbone': 'lib/backbone',
    'underscore': 'lib/underscore',
    'text': 'lib/require.text',
    'swig': 'lib/swig',
    'tpl': 'util/tpl/tpl'
  },

  tplPath: '/templates'
});
