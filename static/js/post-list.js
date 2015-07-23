/* global define */

define(['lib/base-view', 'tpl!/pages/_posts-page.html', 'lib/request', 'lib/dom', 'util/util', 'underscore'],
function(BaseView, postsPageTemplate, request, dom, util, _) {
  'use strict';

  var PostListView = BaseView.extend({
    initialize: function(options) {
      var self = this;

      BaseView.prototype.initialize.call(this, options);

      this.content = dom.select('.content');

      this._postsScrollHandler = _.throttle(function() {
        var ch = self.content.offsetHeight;

        _.each(self.$('.js-page'), function(page) {
          var pagenum = parseInt(page.getAttribute('data-page'), 10) || 1;
          var pos = page.offsetTop - self.content.scrollTop;

          if (pos >= 0 && pos < ch) {
            self.app.navigate(self.pageLink(pagenum),
                              {trigger: false, replace: true});
            return false;
          }
        });
      }, 1000);

      dom.on(this.content, 'scroll', this._postsScrollHandler);

      this.on('rendered', this.onRender);
    },

    events: {
      'click .js-more': 'loadNext'
    },

    onRender: function() {
      if (_.isEmpty(this.data)) {
        return;
      }
      this.updatePager(this.data.page, this.data.has_next);
    },

    loadNext: function(evt) {
      evt.preventDefault();

      var pager = evt.target;
      var showPager = !pager.classList.contains('hidden');
      pager.classList.add('hidden');

      request.get(pager.getAttribute('href'))
        .then(function(resp) {
          var posts = postsPageTemplate(resp.data);

          dom.append(this.$('.js-posts-list')[0], posts.trim());
          var unread = this.$('.js-unread-posts');
          if (unread.length > 0) {
            unread[0].setAttribute('data-unread', resp.data.unread_posts || 0);
          }

          this.updatePager(resp.data.page, resp.data.has_next);
        }.bind(this))

        .catch(function() {
          if (showPager) {
            pager.classList.add('hidden');
          } else {
            pager.classList.remove('hidden');
          }
          console.log(arguments);
        });
    },

    pageLink: function(page) {
      var loc = util.parseUrl(location.pathname.match(this.urlPattern)[0]);
      var dirs = loc.pathname.replace(/\/+$/, '').split(/\/+/);

      if (page > 1) {
        dirs.push(page);
      }

      return dirs.join('/') + loc.search;
    },

    updatePager: function(page, has_next) {
      var pager = this.$('.js-more')[0];
      if (!pager) {
        return;
      }
      pager.classList.toggle('hidden', !has_next);

      pager.setAttribute('href', this.pageLink(page + 1));
    },

    destroy: function() {
      BaseView.prototype.destroy.apply(this, arguments);
      dom.off(this.content, 'scroll', this._postsScrollHandler);
    }
  });

  return PostListView;
});

