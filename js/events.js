
// Click on a url changes text in box
$(function () {
  $('.altMatchURL').click( function () {
    $('#matchURL').val($(this).text());
  });
});
