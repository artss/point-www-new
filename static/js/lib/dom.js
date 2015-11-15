/* global define */

define(function(require) {
  'use strict';

  var _ = require('underscore');

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

      return div.childNodes.length === 1 ? div.childNodes[0] : div.childNodes;
    },

    /**
     * Append element(s) or HTML
     */
    append: function(target, el) {
      if (_.isString(el)) {
        target.insertAdjacentHTML('beforeend', el);
      } else if (el instanceof Node) {
        target.appendChild(el);
      } else if (el instanceof NodeList) {
        _.each(Array.prototype.slice.apply(el), function(node) {
          target.appendChild(node);
        });
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
        targets = dom.selectAll(targets);
      } else if (_.isUndefined(targets.length) || targets instanceof window.constructor) {
        targets = [targets];
      }

      function eventHandler(evt) {
        if (!selector) {
          callback.call(evt.target, evt);
          return;
        }

        var brk = false;

        var path = evt.path || dom.parents(evt.target);

        _.each(path, function(el) {
          if (brk) {
            return;
          }

          if (el === evt.target) {
            brk = true;
          }

          if (dom.matches(el, selector)) {
            callback.call(el, evt);
            brk = true;
          }
        });
      }

      callback._handler = eventHandler;

      _.each(targets, function(target) {
        target.addEventListener(event, eventHandler, false);
      });
    },

    /**
     * Remove event handler.
     */
    off: function(targets, event, callback) {
      if (!targets) {
        return;
      }

      if (targets instanceof Node) {
        targets = [targets];
      }

      if (callback) {
        var eventHandler = callback.hasOwnProperty('_handler') ? callback._handler : callback;
        _.each(targets, function(target) {
          target.removeEventListener(event, eventHandler);
        });
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
    },

    /**
     * Parents list
     */
    parents: function(el) {
      var parents = [];

      while (el) {
        parents.push(el);
        el = el.parentNode;
      }

      return parents;
    }
  };

  return dom;
});

