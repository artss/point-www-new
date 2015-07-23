/* global require */

require(['app', 'backbone', 'underscore', 'lib/dom', 'util/util', 'backbone.nativeajax'],
function (App, Backbone, _, dom, util, nativeajax) {
  'use strict';

  Backbone.ajax = nativeajax;

  if ('ontouchstart' in document.documentElement) {
    document.body.classList.add('touch-device');
  }

  // TODO: move it to post form view
  /*var mainDiv = document.querySelector('.main');

  $('.btn-newpost').click(function () {
    sidebar.toggle(false);
    mainDiv.addClass('newpost');
  });

  $('.popup-newpost .btn-cancel').click(function () {
    mainDiv.removeClass('newpost');
  });

  $('textarea').autosize();

  $('.upload').on('change', 'input', function () {
    var num = $(this).closest('.upload').find('.number');
    num.toggleClass('positive', this.files.length > 0);
    num.text(this.files.length);
  });*/

  var app = new App();

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

  Backbone.history.start({pushState: true, root: '/'});
});

