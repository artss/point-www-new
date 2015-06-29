/* global define */

define(['backbone', 'jquery'], function(Backbone, $) {
  'use strict';

  var BaseView = Backbone.View.extend({
    initialize: function(options) {
      Backbone.View.prototype.initialize.call(this, options);

      this.app = options.app;

      this.on('rendered', this.subscribeScroll);
    },

    subscribeScroll: function() {
      var $header = $('.header');

      if ($header.length === 0) {
        return;
      }

      var hh = $header.height();

      this.$content = $('.content');
      var pos = this.$content.scrollTop();

      this.$content.on('scroll.baseview', function() {
        var newpos = this.$content.scrollTop();
        var ho = $header.offset();

        if (newpos <= pos) {
          if (ho.top < -hh) {
            ho.top = -hh;
          } else if (ho.top > 0) {
            ho.top = 0;
          }
          $header.offset(ho);
        }

        $header.toggleClass('scrolled', newpos > 0);

        pos = newpos;
      }.bind(this));
    },

    destroy: function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.$content.off('scroll.baseview');
      Backbone.View.prototype.remove.call(this);
    }
  });

  return BaseView;
});

