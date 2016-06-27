'use strict'

function page (path, view, main, aside) {
  return {
    path,
    view,
    main: main || view,
    aside: aside || 'site-about'}
}

module.exports = [
  page('', 'homepage', 'site-index', 'site-about')
]
