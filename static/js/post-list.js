/* global define, require */

define(['base-view', 'tpl!/pages/_post.html', 'util/util', 'underscore', 'jquery'],
function(BaseView, postTemplate, util, _, $) {
  'use strict';

  var PostListView = BaseView.extend({
    initialize: function(options) {
      BaseView.prototype.initialize.call(this, options);

      this.template = options.template;
      this.data = options.data;
    },

    events: _.extend(BaseView.prototype.events, {
      'click .js-more': 'loadNext'
    }),

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
          var posts = _.map(resp.data.posts, function(post) {
            return postTemplate({p: post});
          });

          this.$('.js-posts-list').append($.trim(posts.join('')));
          this.$('.js-unread-posts').attr('data-unread', resp.data.unread_posts);

          this.updatePager(resp.data.page, resp.data.has_next);
        }.bind(this))

        .error(function() {
          $pager.toggleClass('hidden', !showPager);
        })

        .always(function() {
        });
    },

    updatePager: function(page, has_next) {
      var $pager = this.$('.js-more');
      $pager.toggleClass('hidden', !has_next);

      var loc = util.parseUrl($pager.attr('href'));
      var href = loc.pathname.replace(/\d+\/?$/, page + 1) + loc.search;
      $pager.attr('href', href);
    }
  });

  return PostListView;
});

