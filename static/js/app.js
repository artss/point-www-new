/* global define */

define(['backbone', 'underscore', 'jquery', 'sidebar', 'post-list'], function(Backbone, _, $, sidebar, PostListView) {
  'use strict';

  var _initial = true;

  var $content = $('.js-content');

  var App = Backbone.Router.extend({
    routes: {
      'recent(/unread)(/:page)(/)': function() {
        return this.postsList('/recent(/unread)?');
      },

      'u/:login/info(/)': 'userInfo',

      'u/:login(/:page)(/)': function() {
        return this.postsList('/u/[a-zA-Z0-9]+');
      },

      'comments(/unread)(/:page)(/)': function() {
        return this.postsList('/comments(/unread)?');
      },

      'messages(/:page)(/)': function() {
        return this.postsList('/messages');
      },
      'messages/unread(/:page)(/)': function() {
        return this.postsList('/messages/unread');
      },
      'messages/incoming(/:page)(/)': function() {
        return this.postsList('/messages/incoming');
      },
      'messages/outgoing(/:page)(/)': function() {
        return this.postsList('/messages/outgoing');
      },

      'bookmarks/:page(/)': function() {
        return this.postsList(/\/bookmarks/);
      },

      'p/:post': 'showPost'
    },

    initialize: function() {
      Backbone.Router.prototype.initialize.apply(this, arguments);
      sidebar.init();
    },

    loadView: function(View, url, urlPattern) {
      sidebar.toggle(false);

      var $el;

      if (_initial) {
        $el = $('.js-view');
        this._currentView = new View({el: $el[0], app: this, urlPattern: urlPattern});
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
        this._currentView = new View(_.extend(resp, {el: $el[0], app: this, urlPattern: urlPattern}));

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

    postsList: function(urlPattern) {
      this.loadView(PostListView, location.href, new RegExp('^' + urlPattern));
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

