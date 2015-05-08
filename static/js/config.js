require.config({
  baseUrl: 'js',

  shim: {
    'lib/jquery.autosize': {
      deps: ['jquery']
    },
  },

  paths: {
    'jquery': 'lib/jquery',
    'backbone': 'lib/backbone',
    'swig': 'lib/swig',
    'underscore': 'lib/underscore'
  }
});
