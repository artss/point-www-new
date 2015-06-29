/* global define */

define(['backbone', 'underscore', 'jquery', 'sidebar', 'post-list'], function(Backbone, _, $, sidebar, PostListView) {
  'use strict';

  var _initial = true;

  var $content = $('.js-content');

  var App = Backbone.Router.extend({
    routes: {
      'recent(/)': 'postsList',
      'recent/:page(/)': 'postsList',
      'recent/unread(/)': 'postsList',
      'recent/unread/:page(/)': 'postsList',

      'u/:login/info(/)': 'userInfo',

      'u/:login(/)': 'postsList',
      'u/:login/:page(/)': 'postsList',

      'comments(/)': 'postsList',
      'comments/:page(/)': 'postsList',
      'comments/unread(/)': 'postsList',
      'comments/unread/:page(/)': 'postsList',

      'messages(/)': 'postsList',
      'messages/:page(/)': 'postsList',
      'bookmarks(/)': 'postsList',
      'bookmarks/:page(/)': 'postsList',

      'p/:post': 'showPost'
    },

    initialize: function() {
      Backbone.Router.prototype.initialize.apply(this, arguments);
      sidebar.init();
    },

    loadView: function(View, url) {
      sidebar.toggle(false);

      var $el;

      if (_initial) {
        $el = $('.js-view');
        this._currentView = new View({el: $el[0], app: this});
        _initial = false;
        $content.append($el);
        this._currentView.trigger('rendered');
        return;
      }

      if (this._xhr && this._xhr.abort) {
        this._xhr.abort();
      }

      this._xhr = $.getJSON(url)
      .success(function(resp) {
        if (this._currentView) {
          this._currentView.$el.remove();
          this._currentView.destroy();
        }

        $el = $('<div class="js-view"></div>');
        this._currentView = new View(_.extend(resp, {el: $el[0], app: this}));

        if (_.isObject(resp.data) && !_.isUndefined(resp.data.menu)) {
          sidebar.setMenu(resp.data.menu);
          this._currentView.$el.addClass(resp.data.menu + '-view');
        }

        this._currentView.render().then(function() {
          $content.append($el);
          this._currentView.trigger('rendered');

          this._currentView.on('navigate', function() {
            console.log('navigate', this, arguments);
          }, this);
        }.bind(this));

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

  return App;
});

