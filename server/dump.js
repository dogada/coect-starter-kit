var debug = require('debug')('site:dump')

exports.dumpSession = function(req, res, next) {
  debug('session', req.sessionID, req.session)
  next()
}

exports.dumpHeaders = function(req, res, next) {
  debug('headers', req.headers)
  next()
}

