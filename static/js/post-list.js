/* global define, require */

define(['base-view', 'tpl!/pages/_posts-page.html', 'util/util', 'underscore', 'jquery'],
function(BaseView, postsPageTemplate, util, _, $) {
  'use strict';

  var PostListView = BaseView.extend({
    initialize: function(options) {
      var self = this;

      BaseView.prototype.initialize.call(this, options);

      this.template = options.template;
      this.data = options.data;

      this.$content = $('.content');

      this.$content.on('scroll.post-list', _.throttle(function() {
        var ch = self.$content.height();

        self.$('.js-page').each(function() {
          var $page = $(this);
          var page = $page.data('page');
          var pos = $page.offset().top;
          //console.log(page, pos);

          if (pos >= 0 && pos < ch) {
            self.app.navigate(self._pageLink(location.href, page),
                              {trigger: false, replace: true});
            return false;
          }
        });
      }, 1000));
    },

    events: {
      'click .js-more': 'loadNext'
    },

    render: function() {
      var dfd = $.Deferred();

      require(['tpl!' + this.template], function(template) {
        this.$el.append(template(this.data));

        this.updatePager(this.data.page, this.data.has_next);

        dfd.resolve();
      }.bind(this));

      return dfd.promise();
    },

    loadNext: function(evt) {
      evt.preventDefault();

      var $pager = $(evt.target);
      var showPager = !$pager.hasClass('hidden');
      $pager.addClass('hidden');

      $.getJSON($pager.attr('href'))
        .success(function(resp) {
          var posts = postsPageTemplate(resp.data);

          this.$('.js-posts-list').append($.trim(posts));
          this.$('.js-unread-posts').attr('data-unread', resp.data.unread_posts);

          this.updatePager(resp.data.page, resp.data.has_next);
        }.bind(this))

        .error(function() {
          $pager.toggleClass('hidden', !showPager);
        })

        .always(function() {
        });
    },

    _pageLink: function(href, page) {
      var loc = util.parseUrl(href);
      var dirs = loc.pathname.replace(/\/+$/).split(/\/+/);
      if (/^\d+$/.test((dirs[dirs.length - 1]))) {
        dirs.pop();
      }

      if (page > 1) {
        dirs.push(page);
      }

      return dirs.join('/') + loc.search;
    },

    updatePager: function(page, has_next) {
      var $pager = this.$('.js-more');
      $pager.toggleClass('hidden', !has_next);

      $pager.attr('href', this._pageLink($pager.attr('href'), page + 1));
    },

    destroy: function() {
      BaseView.prototype.destroy.apply(this, arguments);
      this.$content.off('scroll.post-list');
    }
  });

  return PostListView;
});

