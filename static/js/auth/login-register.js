/* global define */

define(['auth/reg-form', 'auth/login-form', 'lib/dom'], function (RegForm, LoginForm, dom) {
  'use strict';

  var wrap = dom.select('.login-wrap');

  if (!wrap) {
    return;
  }

  dom.on(dom.select(wrap, '.reg-link'), 'click', function (evt) {
    evt.preventDefault();
    wrap.classList.remove('login');
    setTimeout(function() {
      regForm.focus('login');
    }, 501);
  });

  dom.on(dom.select(wrap, '.login-link'), 'click', function (evt) {
    evt.preventDefault();
    wrap.classList.add('login');
    setTimeout(function() {
      loginForm.focus('login');
    }, 501);
  });

  var regForm = new RegForm({el: dom.select(wrap, '.reg-form')});
  regForm.render();

  var loginForm = new LoginForm({el: dom.select(wrap, '.login-form')});
  loginForm.render();
  loginForm.on('success', function() {
    window.location = window.location;
  });
});

