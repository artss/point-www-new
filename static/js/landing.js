define(['reg-form', 'login-form', 'jquery'], function (RegForm, LoginForm, $) {
  var wrap = $('.login-wrap');

  wrap.find('.reg-link').click(function (evt) {
    evt.preventDefault();
    wrap.removeClass('login');
  });

  wrap.find('.login-link').click(function (evt) {
    evt.preventDefault();
    wrap.addClass('login');
  });

  var regForm = new RegForm({el: wrap.find('.reg-form')[0]});
  regForm.render();

  var loginForm = new LoginForm({el: wrap.find('.login-form')[0]});
  loginForm.render();
});

