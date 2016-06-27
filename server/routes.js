'use strict';

var express = require('express')
var debug = require('debug')('site:routes')
var coect = require('coect')
var umedia = require('coect-umedia')

var core = require('../core/server/')
var account = require('coect-account')
var admin = require('coect-admin')

var security = require('./security')

var handlers = require('./handlers')
var User = require('./db').User
var urls = require('../config/urls')
var LOGIN_URL = '/me/'

function adminRequired(req, res, next) {
  if (req.user && req.user.isAdmin()) next()
  else next(coect.HttpError(403, 'Admin required'))
}

function loginRequired(req, res, next) {
  if (req.user) next()
  else if (req.xhr) next(coect.HttpError(401, 'Login required'))
  else res.redirect(LOGIN_URL)
}

function attach(ctx) {
  return function(req, res, next) {
    Object.assign(req, ctx)
    next()
  }
}

function locals(ctx) {
  return function(req, res, next) {
    Object.assign(res.locals, ctx)
    next()
  }
}

function notfound(req, res, next) {
  next(coect.HttpError(404, 'Not found'))
}

function apiRouter(endpoints) {
  return coect.router.routeAPI(
    new express.Router(), endpoints)
}

module.exports = function(app) {
  debug('init')
  app.use('/', attach({
    security: security.umedia,
    coect: {
      User: User,
      urls: urls,
      security: security.umedia
    }
  }))

  app.get('/me/', handlers.base)  // show login form or profile
  //app.use('/me/', loginRequired, account.user.routes(app, new express.Router()))
  app.use('/api/account/auth/', account.auth.routes(new express.Router()))
  app.use('/api/account/', account.routes.api(new express.Router()))
  app.use('/api/core/', apiRouter(core.endpoints))

  app.use('/a/', adminRequired, locals({module: 'admin'}), admin.defaultRoutes(new express.Router()))
  app.use('/', umedia.routes(new express.Router()))

  app.get('/', core.handlers.homepage)

  app.get('/*', handlers.base)
  
  //app.use(notfound)
}
