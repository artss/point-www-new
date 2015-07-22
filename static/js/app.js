/* global define */

define(['backbone', 'underscore', 'lib/request', 'lib/dom', 'sidebar', 'post-list'],
function(Backbone, _, request, dom, SidebarView, PostListView) {
  'use strict';

  var _initial = true;

  var content = dom.select('.js-content');

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

      this.sidebar = new SidebarView({el: '.sidebar'});
    },

    loadView: function(View, url, urlPattern) {
      this.sidebar.toggle(false);

      var el;

      if (_initial) {
        el = dom.select('.js-view');
        this._currentView = new View({el: el, app: this, urlPattern: urlPattern});
        _initial = false;
        content.appendChild(el);
        this._currentView.trigger('rendered');
        return;
      }

      if (this._request) {
        console.log('abort', this._request);
        this._request.cancel();
      }

      this._request = request.getJSON(url);
      this._request.then(function(resp) {
        if (this._currentView) {
          this._currentView.el.remove();
          this._currentView.destroy();
        }

        el = dom.create('<div class="js-view"></div>')[0];
        this._currentView = new View(_.extend(resp, {el: el, app: this, urlPattern: urlPattern}));

        if (_.isObject(resp.data) && !_.isUndefined(resp.data.menu)) {
          this.sidebar.setMenu(resp.data.menu);
          this._currentView.el.classList.add(resp.data.menu + '-view');
        }

        this._currentView.render()
        .then(
          function() {
            content.appendChild(el);
            this._currentView.trigger('rendered');

            this._currentView.on('navigate', function() {
              console.log('navigate', this, arguments);
            }, this);
          }.bind(this),
          function() {}
        );

        delete this._request;
      }.bind(this))
      .catch(function(xhr, status) {
        console.log('catch', xhr, status);
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

