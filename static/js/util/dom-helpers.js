/* global define */

define(['underscore'], function(_) {
  'use strict';

  var dh = {
    select: function(target, selector) {
      if (_.isString(target)) {
        selector = target;
        target = document;
      }

      return target.querySelector(selector);
    },

    selectAll: function(target, selector) {
      if (_.isString(target)) {
        selector = target;
        target = document;
      }

      return target.querySelectorAll(selector);
    },

    on: function(targets, event, selector, callback) {
      if (_.isFunction(selector)) {
        callback = selector;
        selector = undefined;
      }

      if (_.isString(targets)) {
        targets = dh.select(targets);
      } else if (_.isUndefined(targets.length)) {
        targets = [targets];
      }

      function eventHandler(evt) {
        if (!selector || evt.target.matches(selector)) {
          callback(evt);
        }
      }

      _.each(targets, function(target) {
        target.addEventListener(event, eventHandler);
      });
    },

    off: function() {
      // TODO: off
    }
  };

  return dh;
});

