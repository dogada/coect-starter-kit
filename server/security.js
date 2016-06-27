var UmediaAccessPolicy = require('coect-umedia').security
var Channel = require('./db').Channel
var Access = require('coect').Access
var config = require('../server/config')

exports.umedia = new UmediaAccessPolicy({
  guestAccess: Access.MODERATION,
  mode: config.umedia.mode
})


