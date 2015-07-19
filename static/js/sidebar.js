/* global define */

define(['base-view', 'jquery', 'auth/login-register'], function (BaseView, $) {
  'use strict';

  var $win = $(window);
  var $doc = $(document);
  var $mainDiv = $('.main');
  var winWidth;

  var startX, startY, lastX, lastY, swipe;

  var SidebarView = BaseView.extend({
    initialize: function() {
      BaseView.prototype.initialize.apply(this, arguments);

      $(window).on('resize.sidebar', this._updateSize.bind(this));
      this._updateSize();

      $doc.on('touchstart', function (evt) {
        var oevt = evt.originalEvent;

        if (oevt.touches.length !== 1) {
          return;
        }

        startX = oevt.touches[0].clientX;
        startY = oevt.touches[0].clientY;
        lastX = startX;
        lastY = startY;

        if (!$mainDiv.hasClass('sidebar-open') && startX > winWidth / 4) {
          this.resetSwipe();
        }

        $('.screen-hint').remove();
      }.bind(this));

      $doc.on('touchmove', function (evt) {
        var oevt = evt.originalEvent;
        if (oevt.touches.length !== 1) {
          return;
        }
        lastX = oevt.touches[0].clientX;
        lastY = oevt.touches[0].clientY;

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

      $doc.on('touchend', function () {
        //evt.stopPropagation();
        //evt.preventDefault();

        if (swipe) {
          this.checkPos();
          return;
        }
        this.resetSwipe();
      }.bind(this));

      $doc.on('touchcancel', this.resetSwipe.bind(this));

      $('.sidebar-handle').on('click', this.toggle.bind(this));
    },

    toggle: function(state) {
      if (typeof state === 'undefined') {
        state = !$mainDiv.hasClass('sidebar-open');
      }

      $mainDiv.toggleClass('sidebar-open', state);
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
      this.$('.menu-item').each(function() {
        var $item = $(this);
        $item.toggleClass('active', Boolean(id && $item.hasClass(id)));
      });
    },

    _updateSize: function() {
      winWidth = $win.width();
      this._width = this.$el.width();
    }
  });

  return SidebarView;
});

