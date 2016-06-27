var debug = require('debug')('site:static')

var path = require('path')
var express = require('express');

module.exports = function(app) {
  app.use('/_static/', function(req, res, next) {
    // remove hashes from static urls
    var url = req.url
    req.url = req.url.replace (/\/([^\/]+)-[0-9a-f]{8}\.(css|js|jpg|png|gif|svg)$/, '/$1.$2')
    debug('rewrote', url, ' -> ', req.url)
    next();
  })

  var maxAge = (app.get('env') !== 'development') ? '365d' : 0
  var staticPath = path.join(__dirname, '../public')
  debug('initStatic', staticPath)
  app.use('/_static', express.static(staticPath, {
    fallthrough: false,
    maxAge: maxAge
  }))
}
