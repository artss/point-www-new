/* global define, env */

define(function(require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var request = require('lib/request');
  var dom = require('lib/dom');
  var UserModel = require('lib/user-model');
  var BaseView = require('lib/base-view');
  var SidebarView = require('sidebar');
  var ErrorView = require('lib/error-view');
  var PostListView = require('post-list');
  var Post = require('post');

  var _initial = true;

  var mainDiv = dom.select('.js-main');
  var content = dom.select('.js-content');
  var footer = dom.select(content, '.js-footer');

  var App = Backbone.Router.extend({
    routes: {
      'recent(/unread)(/:page)(/)': function() {
        return this.postsList('/recent(/unread)?');
      },

      'u/:login/info(/)': 'pageView',

      'profile(/:section)(/)': 'pageView',

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
      'bookmarks(/:page)(/)': function() {
        return this.postsList('/bookmarks');
      },

      'bookmarks/:page(/)': function() {
        return this.postsList(/\/bookmarks/);
      },

      'p/:post': 'postView'
    },

    initialize: function() {
      Backbone.Router.prototype.initialize.apply(this, arguments);

      this.user = env.user = new UserModel(env.user);

      this.sidebar = new SidebarView({el: '.sidebar'});
      this.sidebar.toggle(false);
    },

    loadView: function(View, data, urlPattern) {
      this.sidebar.toggle(false);

      if (!urlPattern) {
        urlPattern = /.*/;
      }

      var el;

      if (_initial) {
        el = dom.select('.js-view');
        this._currentView = new View({el: el, app: this, urlPattern: urlPattern});
        _initial = false;
        this._currentView.trigger('rendered');
        mainDiv.classList.remove('loading');
        return;
      }

      mainDiv.classList.add('loading');

      if (this._request && _.isFunction(this._request.cancel)) {
        this._request.cancel();
      }

      if (_.isString(data) && data.match(/^http|\//)) {
        this._request = request.get(data);
      } else {
        this._request = new Promise(function(resolve) {
          resolve(data);
        });
      }

      this._request.then(function(resp) {
        if (this._currentView) {
          this._currentView.el.remove();
          this._currentView.destroy();
        }

        el = dom.create('<div class="js-view"></div>');

        if (_.isObject(resp.data) && !_.isEmpty(resp.data.menu)) {
          this.sidebar.setMenu(resp.data.menu);
          resp.className = resp.data.menu + '-view';
        }

        this._currentView = new View(_.extend(resp, {el: el, app: this, urlPattern: urlPattern}));

        this._currentView.render().then(
          function() {
            //content.insertAdjacentElement('afterBegin', el);
            content.insertBefore(el, footer);
            this._currentView.trigger('rendered');

            mainDiv.classList.remove('loading');
          }.bind(this),
          function() {}
        );

        delete this._request;
      }.bind(this))
      .catch(function(resp, status) {
        //console.log('catch', resp, status);

        this.loadView(ErrorView, resp);
        mainDiv.classList.remove('loading');
      }.bind(this));
    },

    postsList: function(urlPattern) {
      this.loadView(PostListView, location.href, new RegExp('^' + urlPattern));
    },

    postView: function() {
      this.loadView(Post.View, location.href);
    },

    pageView: function() {
      //console.log('+ pageView');
      this.loadView(BaseView, location.href);
    }
  });

  if (!env.user.id) {
    require('auth/login-register');
  }

  return App;
});

