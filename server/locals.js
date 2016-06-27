var debug = require('debug')('site:locals')
var _ = require('lodash')
var tflow = require('tflow')
var config = require('./config')
var db = require('./db')
var redis = require('./redis')
var version = require('../package.json').version
var createSite = require('./site') // Set global Site

module.exports = function(req, res, done) {
  tflow([
    function() {
      _.extend(res.locals, {
        version: version,
        analytics: config.analytics,
        clientDebug: config.debug.client,
        user: req.user,
        config: {},
        path: req.path,
        site: !req.xhr && createSite()
      })
      //debug('res.locals', Object.keys(res.locals))
      this.complete()
    },
  ], done)
}
