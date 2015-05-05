define(["jquery"], function ($) {
  var wrap = $(".login-wrap");

  wrap.find(".reg-link").click(function (evt) {
    evt.preventDefault();
    wrap.removeClass("login");
  });

  wrap.find(".login-link").click(function (evt) {
    evt.preventDefault();
    wrap.addClass("login");
  });

  var recaptcha = wrap.find(".recaptcha");

  wrap.find(".reg-form input").focus(function () {
    if (recaptcha.hasClass("open")) return;
    recaptcha.addClass("open");
  });
});
