define(['auth/reg-form', 'auth/login-form', 'jquery'], function (RegForm, LoginForm, $) {
  var wrap = $('.login-wrap');

  wrap.find('.reg-link').click(function (evt) {
    evt.preventDefault();
    wrap.removeClass('login');
    setTimeout(function() {
      regForm.focus('login');
    }, 501);
  });

  wrap.find('.login-link').click(function (evt) {
    evt.preventDefault();
    wrap.addClass('login');
    setTimeout(function() {
      loginForm.focus('login');
    }, 501);
  });

  var regForm = new RegForm({el: wrap.find('.reg-form')[0]});
  regForm.render();

  var loginForm = new LoginForm({el: wrap.find('.login-form')[0]});
  loginForm.render();
  loginForm.on('success', function() {
    window.location = window.location;
  });
});

