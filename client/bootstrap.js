require('bootstrap-show-password/bootstrap-show-password.min.js')

$(function() {
  // close collapsed Bootstrap 3 menu on click:
  // http://stackoverflow.com/questions/21203111/bootstrap-3-collapsed-menu-doesnt-close-on-click
  $(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') !== 'dropdown-toggle') {
      $(this).collapse('hide')
    }
  })
})
