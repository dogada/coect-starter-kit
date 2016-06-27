'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// redirect debug output to stdout to keep errors and debug in different files
require('debug').log = console.info.bind(console)

var debug = require('debug')('site:app');
debug('Starting app NODE_ENV=', process.env.NODE_ENV)

var config = require('./config')
var express = require('express');
var expressValidator = require('express-validator')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var toobusy = require('toobusy-js')

var methodOverride = require('method-override')

var session = require('express-session')
var flash = require('express-flash')

var RedisStore = require('connect-redis')(session);
var redis = require('ioredis');
var lusca = require('lusca')

debug('Initalizing db models...')
var db = require('./db') // init knex and map tables to models

var app = express()
debug('Created app for env ', app.get('env'), app)
app.disable('etag')
app.disable('x-powered-by')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var ejs = require('ejs')
app.engine('ejs', ejs.renderFile)
app.locals = require('./helpers')
app.use(logger('dev'))

// app.use(require('./dump').dumpHeaders)

app.use(favicon(__dirname + '/../public/favicon.ico'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cookieParser())
app.use(methodOverride())


app.set('trust proxy', 1) // required for secure cookies used behind Nginx TLS 

// https://www.npmjs.com/package/express-session
var sessionConfig = {
  saveUninitialized: false,
  resave: false,
  secret: config.secrets.session,
  name: config.session.cookie.name,
  proxy: true, // works with NGINX proxy
  cookie: {
    httpOnly: true,
    secure: (app.get('env') !== 'development'),
    maxAge: config.session.cookie.maxAge,
  },
  store: new RedisStore({
    client: redis.createClient(),
    ttl: 30 * 24 * 60 * 60
  })
}
debug('Init session', sessionConfig)
app.use(session(sessionConfig))
//app.use(require('./dump').dumpSession)


var account = require('coect-account')
account.auth.initPassport(app, config.passport)
// FIX with redis used by coect-umedia
app.userCache = account.cache
app.createUser = require('./account').createUser


app.use(flash())


var luscaMiddleware = lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
})

var noProtection = [
  '/_/umedia/webmentionio_hook'
]

//disabled csrf for hooks and urls with OAuth Bearer tokens
app.use((req, res, next) => {
  debug('lusca', req.path, noProtection.indexOf(req.path))
  if (noProtection.indexOf(req.path) > -1) next()
  else luscaMiddleware(req, res, next)
})

// make user available in templates
app.use(require('./locals'))

require('./static')(app)
if (app.get('env') === 'development') {
  require('./__mocha')(app)
}


require('./routes')(app)
require('./errors')(app) // must be last middleware


app.db = db
app.config = config
// configure Riot 
require('../config/riot')

var riot = require('riot')
// TEMP workaround, remove after migration to stores
riot.mixin('coect-context', {})

require('../config/tags.js')
require('../config/admin_tags.js')

// configure umedia
var urls = require('../config/urls')
require('coect-umedia').init({
  urls: urls,
  host: config.defaults.host,
  User: db.User,
  webmentionIo: config.webmentionIo,
  telegraph: config.telegraph
})

module.exports = app
