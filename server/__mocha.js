var debug = require('debug')('site:static')

var path = require('path')
var express = require('express');

module.exports = function(app) {
  var staticPath = path.join(__dirname, '../dev/mocha_public')
  debug('__mocha', staticPath)
  app.use('/__mocha/', express.static(staticPath, {
    fallthrough: false,
    maxAge: 0
  }))
}
