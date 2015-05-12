require(['sidebar', 'jquery', 'lib/jquery.autosize'], function (sidebar, $) {
  if ('ontouchstart' in document.documentElement) {
    $('body').addClass('touch-device');
  }

  var mainDiv = $('.main');

  $(sidebar.init);

  $('.btn-newpost').click(function () {
    sidebar.toggle(false);
    mainDiv.addClass('newpost');
  });

  $('.popup-newpost .btn-cancel').click(function () {
    mainDiv.removeClass('newpost');
  });

  $('textarea').autosize();

  $('.upload').on('change', 'input', function () {
    var num = $(this).closest('.upload').find('.number');
    num.toggleClass('positive', this.files.length > 0);
    num.text(this.files.length);
  });
});
