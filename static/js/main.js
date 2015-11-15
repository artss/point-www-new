require(['app', 'backbone', 'backbone.nativeajax', 'backbone-model-file-upload'],
function (App, Backbone, nativeajax) {
  'use strict';

  Backbone.ajax = nativeajax;


  new App();

  Backbone.history.start({pushState: true, root: '/'});
});

