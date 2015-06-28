/* global define */

define(['jquery', 'login-register'], function ($) {
  'use strict';

  var $mainDiv = $('.main');
  var winWidth = $(window).width();

  var $sidebarDiv = $('.sidebar');
  var sidebarWidth = $sidebarDiv.width();

  var startX, startY, lastX, lastY, swipe;

  $(window).resize(function () {
    winWidth = $(window).width();
    sidebarWidth = $sidebarDiv.width();
  });

  function toggleSidebar (state) {
    if (typeof state === 'undefined') {
      state = !$mainDiv.hasClass('sidebar-open');
    }

    $mainDiv.toggleClass('sidebar-open', state);
  }

  function checkPos () {
    var right = startX <= lastX;

    if (Math.abs(lastX - startX) >= sidebarWidth * 0.5) {
      toggleSidebar(Boolean(right));
    }
  }

  function resetSwipe () {
    swipe = false;
    startX = null;
    startY = null;
    lastX = null;
    lastY = null;
  }

  var doc = $(document);

  function initSidebar () {
    doc.on('touchstart', function (evt) {
      var oevt = evt.originalEvent;

      if (oevt.touches.length !== 1) {
        return;
      }

      startX = oevt.touches[0].clientX;
      startY = oevt.touches[0].clientY;
      lastX = startX;
      lastY = startY;

      if (!$mainDiv.hasClass('sidebar-open') && startX > winWidth / 4) {
        resetSwipe();
      }

      $('.screen-hint').remove();
    });

    doc.on('touchmove', function (evt) {
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
        resetSwipe();
      }
    });

    doc.on('touchend', function () {
      //evt.stopPropagation();
      //evt.preventDefault();

      if (swipe) {
        checkPos();
        return;
      }
      resetSwipe();
    });

    doc.on('touchcancel', function () {
      resetSwipe();
    });

    $('.sidebar-handle').on('click', function () {
      toggleSidebar();
    });
  }

  function setMenu(id) {
    $sidebarDiv.find('.menu-item').each(function() {
      var $item = $(this);
      $item.toggleClass('active', Boolean(id && $item.hasClass(id)));
    });
  }

  return {
    init: initSidebar,
    toggle: toggleSidebar,
    setMenu: setMenu
  };
});

