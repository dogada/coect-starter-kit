'use strict';

//make debug available for riot tags
var debug = window.debug = require('debug')('root')
debug('Started main')

var app = require('./app')
window.riot = app.riot

require('./routes')(app.urls)

$(function() {
  debug('DOM ready')
  let dispatch = !Site.state.page.view
  debug('Starting page.js routing, dispatch:', dispatch, 'notfound', Site.notfound)
  Site.page('*', Site.notfound)
  Site.page.start({dispatch})
})

debug('Finished main')
