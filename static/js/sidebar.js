/* global define */

define(['base-view', 'lib/dom', 'underscore', 'auth/login-register'], function (BaseView, dom, _) {
  'use strict';

  var mainDiv = dom.select('.main');
  var winWidth;

  var startX, startY, lastX, lastY, swipe;

  var SidebarView = BaseView.extend({
    initialize: function() {
      BaseView.prototype.initialize.apply(this, arguments);

      dom.on(window, 'resize', this._updateSize.bind(this));
      this._updateSize();

      dom.on(document, 'touchstart', function (evt) {
        if (!evt.touches || evt.touches.length !== 1) {
          return;
        }

        startX = evt.touches[0].clientX;
        startY = evt.touches[0].clientY;
        lastX = startX;
        lastY = startY;

        if (!mainDiv.classList.contains('sidebar-open') && startX > winWidth / 4) {
          this.resetSwipe();
        }

        var hint = dom.select('.screen-hint');
        if (hint) {
          hint.remove(hint);
        }
      }.bind(this));

      dom.on(document, 'touchmove', function (evt) {
        if (!evt.touches || evt.touches.length !== 1) {
          return;
        }
        lastX = evt.touches[0].clientX;
        lastY = evt.touches[0].clientY;

        var dX = Math.abs(startX - lastX);
        var dY = Math.abs(startY - lastY);

        if (dX >= dY * 2) {
          swipe = true;
          evt.stopPropagation();
          evt.preventDefault();
        } else {
          this.resetSwipe();
        }
      }.bind(this));

      dom.on(document, 'touchend', function () {
        //evt.stopPropagation();
        //evt.preventDefault();

        if (swipe) {
          this.checkPos();
          return;
        }
        this.resetSwipe();
      }.bind(this));

      dom.on(document, 'touchcancel', this.resetSwipe.bind(this));

      dom.on(dom.select('.sidebar-handle'), 'click', function() {
        this.toggle();
      }.bind(this));
    },

    toggle: function(state) {
      if (typeof state === 'undefined') {
        state = !mainDiv.classList.contains('sidebar-open');
      }

      mainDiv.classList.toggle('sidebar-open', state);
    },

    checkPos: function() {
      var right = startX <= lastX;

      if (Math.abs(lastX - startX) >= this._width * 0.5) {
        this.toggle(Boolean(right));
      }
    },

    resetSwipe: function() {
      swipe = false;
      startX = null;
      startY = null;
      lastX = null;
      lastY = null;
    },

    setMenu: function(id) {
      _.each(this.$('.menu-item'), function(item) {
        item.classList.toggle('active', Boolean(id && item.classList.contains(id)));
      });
    },

    _updateSize: function() {
      winWidth = window.offsetWidth;
      this._width = this.el.offsetWidth;
    }
  });

  return SidebarView;
});

