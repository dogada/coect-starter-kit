'use strict';

var debug = require('debug')('site:handlers')
var coect = require('coect')
var tflow = require('tflow')
var store = require('../store')
var riot = require('riot')

exports.overview = function(req, res, next) {
  debug('homepage', res.locals.config)
  var db = req.app.db
  var flow = tflow([
    () => store.channel.list(req, {type: db.Entity.CATEGORY, count: 50}, flow),
    (tags) => db.User.find({orderBy: ['id', 'desc'], limit: 5}, flow.join(tags)),
    (tags, users) => flow.complete({tags, users})
  ], next)
}
