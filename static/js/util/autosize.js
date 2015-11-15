define(function(require) {
  'use strict';

  var _ = require('underscore');
  var dom = require('lib/dom');

  var autosizeElem;

  function getAutosizeElem() {
    if (!autosizeElem) {
      autosizeElem = dom.create('<div class="autosize-textarea"></div>');
      dom.append(document.body, autosizeElem);
    }

    return autosizeElem;
  }

  function autosizeUpdate(evt) {
    var elem = getAutosizeElem();
    elem.textContent = evt.target.value;

    evt.target.style.height = elem.offsetHeight + 'px';
  }

  var styles = ['width', 'fontSize', 'fontFamily', 'lineHeight',
               'border', 'boxSizing',
               'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];

  function autosizeFocus(evt) {
    var elem = getAutosizeElem();

    var style = window.getComputedStyle(evt.target, null);

    _.each(styles, function(key) {
      elem.style[key] = style[key];
    });

    autosizeUpdate(evt);
  }

  function autosize(inputs) {
    dom.on(inputs, 'focus', autosizeFocus);
    dom.on(inputs, 'input', autosizeUpdate);
    dom.on(inputs, 'keyup', autosizeUpdate);
  }

  return autosize;
});

