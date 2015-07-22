/* global define */

define(['backbone', 'backbone.nativeview', 'lib/dom'], function(Backbone, _nv, dom) {
  'use strict';

  var BaseView = Backbone.NativeView.extend({
    initialize: function(options) {
      Backbone.NativeView.prototype.initialize.call(this, options);

      this.app = options.app;

      this.on('rendered', this.subscribeScroll);
    },

    subscribeScroll: function() {
      this.header = dom.select('.header');

      if (this.header.length === 0) {
        return;
      }

      this.content = dom.select('.content');
      this._scrollTop = this.content.scrollTop;

      this._scrollHandler = this._scrollHandler.bind(this);

      dom.on(this.content, 'scroll', this._scrollHandler);
    },

    _scrollHandler: function() {
      var pos = this.content.scrollTop;

      if (pos > this._scrollTop) {
        this.header.classList.add('hidden');
      } else if (pos <= this._scrollTop - 3) {
        this.header.classList.remove('hidden');
      }

      this.header.classList.toggle('scrolled', pos > 0);

      this._scrollTop = pos;
    },

    destroy: function() {
      this.undelegateEvents();
      dom.off(this.content, 'scroll', this._scrollHandler);
      Backbone.NativeView.prototype.remove.call(this);
    }
  });

  return BaseView;
});

