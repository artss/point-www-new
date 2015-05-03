define(["underscore", "jquery"], function (_, $) {
  function tabs () {
    var el = this;
    var $el = $(this);

    if (!$el.hasClass("tabs-nav")) {
      $el = $el.find(".tabs-nav").eq(0);
      if (!$el.length) return;
      el = $el[0];
    }

    var win = $(window);

    function resize () {
      var tw = $el.find(".tabs-nav-inner").width();
      console.log(win.width(), tw);
      //if (tw > win.width()) {
      //}
    }

    win.on("resize", resize);
    resize();
  }

  $.fn.tabs = function () {
    $(this).each(tabs);
  };
});
