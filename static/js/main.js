/* global require */

require(['backbone' ,'sidebar', 'util/util', 'post-list', 'jquery', 'lib/jquery.autosize'],
function (Backbone, sidebar, util, PostListView, $) {
  'use strict';

  var _initial = true;

  if ('ontouchstart' in document.documentElement) {
    $('body').addClass('touch-device');
  }

  var App = Backbone.Router.extend({
    routes: {
      'recent(/)': 'postsList',
      'recent/:page(/)': 'postsList',
      'u/:login/info(/)': 'userInfo',
      'u/:login(/)': 'postsList',
      'u/:login/:page(/)': 'postsList',
      'comments': 'postsList',
      'messages': 'postsList',
      'bookmarks': 'postsList'
    },

    loadView: function(View, url) {
      if (_initial) {
        _initial = false;
        return;
      }

      if (this._xhr && this._xhr.abort) {
        this._xhr.abort();
      }

      this._xhr = $.get(url)
      .success(function() {
        console.log('= loadView', arguments);
        if (this._currentView) {
          this._currentView.$el.remove();
          this._currentView.destroy();
        }

        this._currentView = new View();

        delete this._xhr;
      }.bind(this))
      .error(function() {
        console.log('- loadView error', arguments);
      });
    },

    postsList: function() {
      this.loadView(PostListView, location.href);
    },

    userInfo: function() {
    }
  });

  $(sidebar.init);

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

  $(document).on('click', 'a', function(evt) {
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

  Backbone.history.start({pushState: true, root: '/'});
});

