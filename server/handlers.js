'use strict';

var debug = require('debug')('site:handlers')
var coect = require('coect')
var tflow = require('tflow')

exports.base = function(req, res, next) {
  debug('base user', typeof req.user, req.user && req.user.id)
  if (req.xhr) throw coect.HttpError(400, 'AJAX handler not found for this url')
  var flow = tflow([
    () => flow.complete({})
  ], coect.janus(req, res, next))
}
