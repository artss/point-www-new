/* global require */

require(['backbone', 'underscore' ,'sidebar', 'util/util', 'post-list', 'jquery', 'lib/jquery.autosize'],
function (Backbone, _, sidebar, util, PostListView, $) {
  'use strict';

  var _initial = true;

  if ('ontouchstart' in document.documentElement) {
    $('body').addClass('touch-device');
  }

  var $content = $('.js-content');

  var App = Backbone.Router.extend({
    routes: {
      'recent/:page(/)': 'postsList',
      'u/:login/info(/)': 'userInfo',
      'u/:login(/)': 'postsList',
      'u/:login/:page(/)': 'postsList',
      'comments(/)': 'postsList',
      'comments/:page(/)': 'postsList',
      'messages(/)': 'postsList',
      'messages/:page(/)': 'postsList',
      'bookmarks(/)': 'postsList',
      'bookmarks/:page(/)': 'postsList',
      'p/:post': 'showPost'
    },

    loadView: function(View, url) {
      var $el;

      if (_initial) {
        $el = $('.js-view');
        this._currentView = new View({el: $el[0]});
        _initial = false;
        $content.append($el);
        return;
      }

      if (this._xhr && this._xhr.abort) {
        this._xhr.abort();
      }

      this._xhr = $.getJSON(url)
      .success(function(data) {
        if (this._currentView) {
          this._currentView.$el.remove();
          this._currentView.destroy();
        }

        $el = $('<div class="js-view"></div>');
        this._currentView = new View(_.extend(data, {el: $el[0]}));
        this._currentView.render();
        $content.append($el);

        delete this._xhr;
      }.bind(this))
      .error(function() {
        console.log('- loadView error', arguments);
      });
    },

    postsList: function() {
      this.loadView(PostListView, location.href);
    },

    showPost: function() {
      console.log('+ showPost');
    },

    userInfo: function() {
      console.log('+ userInfo');
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

  Backbone.history.start({pushState: true, root: '/'});
});

