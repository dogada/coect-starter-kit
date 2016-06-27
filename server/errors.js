'use strict';

var debug = require('debug')('site:errors')
var debugErrorHandler = require('errorhandler')

function logErrors(err, req, res, next) {
  console.error(req.path + ': ' + err)
  console.error(err.stack)
  next(err)
}

function errorStatus(err) {
  return typeof err.status === 'number' ? err.status : 500
}

function ajaxErrorHandler(err, req, res, next) {
  if (req.xhr && !res.headersSent) res.status(errorStatus(err)).send({error: 'Server error'})
  else next(err)
  
}

function errorHandler(err, req, res, next) {
  debug('errorHandler', err)
  if (res.headersSent) return next(err) // use default handler
  res.status(errorStatus(err))
  res.render('index', {error: err})
}


module.exports = function(app) {
  debug('init for env:', app.get('env'))
  //use default error handler in development
  if (app.get('env') !== 'development') {
    debug('init production errors middlewares')
    app.use(logErrors)
    app.use(require('pmx').expressErrorHandler())
    app.use(ajaxErrorHandler)
    app.use(errorHandler)
  }
}

