/* global define */

define(['underscore'], function(_) {
  'use strict';

  var dom = {
    /**
     * Select single element.
     */
    select: function(target, selector) {
      if (_.isString(target)) {
        selector = target;
        target = document;
      }

      return target.querySelector(selector);
    },

    /**
     * Select all matching elements.
     */
    selectAll: function(target, selector) {
      if (_.isString(target)) {
        selector = target;
        target = document;
      }

      return target.querySelectorAll(selector);
    },

    /**
     * Create elements from HTML.
     */
    create: function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;

      return div.childNodes;
    },

    /**
     * Append element or HTML
     */
    append: function(target, el) {
      if (_.isString(el)) {
        target.insertAdjacentHTML('beforeend', el);
      } else if (el instanceof Node) {
        target.appendChild(el);
      } else {
        throw new Error('Invalid element type');
      }
    },

    /**
     * Test whether the element matches the selector
     */
    matches: function(el, selector) {
      return (_.isFunction(el.matches) && el.matches(selector)) ||
             (_.isFunction(el.msMatchesSelector) && el.msMatchesSelector(selector));
    },

    /**
     * Add event handler.
     */
    on: function(targets, event, selector, callback) {
      if (!targets || targets.length === 0) {
        return;
      }

      if (_.isFunction(selector)) {
        callback = selector;
        selector = undefined;
      }

      if (_.isString(targets)) {
        targets = dom.select(targets);
      } else if (_.isUndefined(targets.length)) {
        targets = [targets];
      }

      function eventHandler(evt) {
        if (!selector || dom.matches(evt.target, selector)) {
          callback(evt);
        }
      }

      callback._handler = eventHandler;

      _.each(targets, function(target) {
        target.addEventListener(event, eventHandler);
      });
    },

    /**
     * Remove event handler.
     */
    off: function(target, event, callback) {
      if (!target) {
        return;
      }

      if (callback) {
        var eventHandler = callback.hasOwnProperty('_handler') ? callback._handler : callback;
        target.removeEventListener(event, eventHandler);
        delete callback._handler;
      }
    },

    /**
     * Find closest parent
     */
    closest: function(el, selector) {
      while (el) {
        if (dom.matches(el, selector)) {
          return el;
        }

        el = el.parentNode;
      }
    }
  };

  return dom;
});

