/* global require */

require(['backbone', 'underscore', 'jquery', 'app', 'util/util', 'lib/jquery.autosize'],
function (Backbone, _, $, App, util) {
  'use strict';

  if ('ontouchstart' in document.documentElement) {
    $('body').addClass('touch-device');
  }

  //$(sidebar.init);

  // TODO: move it to post form view
  var mainDiv = $('.main');

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
  });

  var app = new App();

  $(document).on('click', '.js-navigate', function(evt) {
    var $a = $(evt.target).closest('a');

    var loc = util.parseUrl($a.attr('href'));

    if (loc.protocol === location.protocol && loc.host === loc.host) {
      evt.preventDefault();
      app.navigate($a.attr('href'), {trigger: true});
    } else {
      Backbone.history.stop();
      location.href = loc.href;
    }
  });

  $.ajaxSetup({
    success: function(resp) {
      if (_.isObject(resp.data) && !_.isUndefined(resp.data.menu)) {
        app.setMenu(resp.data.menu);
      }
    }
  });

  Backbone.history.start({pushState: true, root: '/'});
});

