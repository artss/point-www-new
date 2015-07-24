/* global define, require */

define(['backbone', 'underscore', 'lib/dom', 'lib/promise', 'backbone.nativeview'], function(Backbone, _, dom, Promise) {
  'use strict';

  var BaseView = Backbone.NativeView.extend({
    initialize: function(options) {
      Backbone.NativeView.prototype.initialize.call(this, options);

      this.app = options.app;

      this.template = options.template;
      this.data = options.data;
      this.urlPattern = options.urlPattern;

      this.on('rendered', function() {
        this.subscribeScroll();
        this.initTabs();
      });
    },

    render: function() {
      var self = this;

      if (_.isArray(this.template)) {
        this.template = this.template[0];
      }

      return new Promise(function(resolve, reject) {
        require(['tpl!' + self.template], function(template) {
          if (!self.urlPattern.test(location.pathname)) {
            reject();
            return;
          }
          dom.append(self.el, template(self.data));
          resolve();
        });
      });
    },

    initTabs: function() {
      var tabs = this.$('.js-tabs');

      if (!tabs) {
        return;
      }

      _.each(tabs, function(container) {
        var nav = dom.select(container, '.tabs-nav');

        var active = dom.select(nav, '.active');
        if (active) {
          if (active.offsetWidth >= container.offsetWidth) {
            container.scrollLeft = active.offsetLeft;
          } else {
            var right = container.scrollLeft + container.offsetWidth - active.offsetLeft - active.offsetWidth;
            if (right < 0) {
              container.scrollLeft = -right;
            }
          }
        }

        var swipe = false;
        var startX;
        var startScroll;

        dom.on(container, 'touchstart', function(evt) {
          if (evt.touches.length > 1) {
            swipe = false;
            return;
          }

          if (container.offsetWidth >= nav.offsetWidth) {
            swipe = false;
            return;
          }

          swipe = true;

          startX = evt.touches[0].clientX;
          startScroll = container.scrollLeft;
        });

        dom.on(container, 'touchmove', function(evt) {
          if (!swipe) {
            return;
          }

          evt.stopPropagation();

          container.scrollLeft = startScroll + startX - evt.touches[0].clientX;
        });
      });
    },

    subscribeScroll: function() {
      this.header = dom.select('.header');

      if (!this.header) {
        return;
      }

      this.content = dom.select('.content');
      this._scrollTop = this.content.scrollTop;

      this._headerScrollHandler = this._headerScrollHandler.bind(this);

      dom.on(this.content, 'scroll', this._headerScrollHandler);
      this._headerScrollHandler();
    },

    _headerScrollHandler: function() {
      var pos = this.content.scrollTop;

      if (pos > this._scrollTop) {
        this.header.classList.add('hidden');
      } else if (pos <= this._scrollTop - 3) {
        this.header.classList.remove('hidden');
      }

      if (pos > 0) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      this._scrollTop = pos;
    },

    destroy: function() {
      this.undelegateEvents();
      dom.off(this.content, 'scroll', this._headerScrollHandler);
      Backbone.NativeView.prototype.remove.call(this);
    }
  });

  return BaseView;
});

