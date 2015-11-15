/* global require */

require(['app', 'backbone', 'lib/dom', 'util/util', 'backbone.nativeajax', 'post-form'],
function (App, Backbone, dom, util, nativeajax, PostForm) {
  'use strict';

  Backbone.ajax = nativeajax;

  if (!('ontouchstart' in document.documentElement)) {
    document.body.classList.remove('touch-device');
  }

  // TODO: move it to post form view
  /*

  $('textarea').autosize();

  $('.upload').on('change', 'input', function () {
    var num = $(this).closest('.upload').find('.number');
    num.toggleClass('positive', this.files.length > 0);
    num.text(this.files.length);
  });*/

  var app = new App();

  var mainDiv = dom.select('.main');

  dom.on(document, 'click', '.js-navigate', function(evt) {
    var href = this.getAttribute('href');

    var loc = util.parseUrl(href);

    if (loc.protocol === location.protocol && loc.host === loc.host) {
      evt.preventDefault();
      app.navigate(href, {trigger: true});
    } else {
      Backbone.history.stop();
      location.href = loc.href;
    }
  });

  var newPostForm;

  Backbone.on('new-post', function() {
    if (!newPostForm) {
      newPostForm = new PostForm.View({ el: dom.select('.popup-newpost') });
    }

    mainDiv.classList.add('newpost');
  });

  Backbone.on('new-post-cancel', function() {
    mainDiv.classList.remove('newpost');
  });

  Backbone.history.start({pushState: true, root: '/'});
});

