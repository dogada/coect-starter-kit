'use strict';

var debug = require('debug')('site:index')

function initLoadingIndicator() {
  $(document).ajaxStart(function () {
    $(document.body).addClass('wait')
  })
  
  $(document).ajaxStop(function () {
    $(document.body).removeClass('wait')
  })
}

function mountStaticTags() {
  var riot = require('riot')
  Site.root = riot.mount('site-layout', {site: Site})[0]
  debug('mountStatic root', Site.root)
  // var navbar = riot.mount('site-navbar')
  // riot.mount('coect-flash')
  //riot.mount('site-main-sidebar', Site.config.sidebar)
}

/**
   Add CSRF token to each AJAX request headers.
*/
function setCSRFToken(csrfToken) {
  debug('setCSRFToken', csrfToken)
  Site.csrfToken = csrfToken
  $.ajaxPrefilter(function(options, _, xhr) {
    if (!xhr.crossDomain) xhr.setRequestHeader('x-csrf-token', csrfToken)
    else xhr.setRequestHeader('x-coect-crossdomain', xhr.crossDomain)
  })
}

function init(opts) {
  setCSRFToken($('meta[name=\"csrf-token\"]').attr('content'))
  initLoadingIndicator();
  mountStaticTags()
}


module.exports = {
  init: init,
}
