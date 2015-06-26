/* global define, require */

define(['base-view', 'tpl!/_post.html', 'util/util', 'underscore', 'jquery'],
function(BaseView, postTemplate, util, _, $) {
  'use strict';

  var PostListView = BaseView.extend({
    initialize: function(options) {
      this.template = options.template;
      this.data = options.data;
    },

    events: {
      'click .js-more': 'loadNext'
    },

    render: function() {
      require(['tpl!' + this.template], function(template) {
        this.$el.append(template(this.data));

        this.updatePager(this.data.page, this.data.has_next);
      }.bind(this));
    },

    loadNext: function(evt) {
      evt.preventDefault();

      var $pager = $(evt.target);
      $pager.prop('disabled', true);

      $.getJSON($pager.attr('href'))
      .success(function(resp) {
        var posts = _.map(resp.data.posts, function(post) {
          post._rec = JSON.stringify(post.rec);
          return postTemplate({p: post});
        });

        this.$('.js-posts-list').append(posts.join(''));

        this.updatePager(resp.data.page, resp.data.has_next);
      }.bind(this))
      .always(function() {
        $pager.prop('disabled', false);
      });
    },

    updatePager: function(page, has_next) {
      var $pager = this.$('.js-more');
      if (!has_next) {
        $pager.hide();
        return;
      }

      var loc = util.parseUrl($pager.attr('href'));
      var href = loc.pathname.replace(/\d+\/?$/, page + 1) + loc.search;
      $pager.attr('href', href);
    }
  });

  return PostListView;
});

