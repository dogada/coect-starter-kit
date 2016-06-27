var debug = require('debug')('site:account')
var Access = require('coect').Access
var tflow = require('tflow')
var db = require('./db'), User = db.User, Channel = db.Channel
var config = require('./config')

/**
   Create User and default blog for them.
   @param {object} data User's data
*/
exports.createUser = function (user, done) {
  debug('createUser', user)
  var flow = tflow([
    function() {
      User.table().count().first().asCallback(this)
    },
    function(userCount) {
      // make first registered user as admin
      // count is 64-bit long and returned as string
      var isFirst = (userCount.count === '0')
      debug('--------- userCount', userCount, isFirst, user.groups)
      if (isFirst && !user.groups) user.groups = ['root', 'admins', 'staff']
      user.save(this)
    },
    function(userId) {
      User.get(userId, {select: '*'}, this)
    },
    function(user) {
      // create channel in user shard
      var c = config.defaults.channel
      var access = (user.isAdmin() || config.umedia.mode === 'community' ? Access.EVERYONE : Access.HIDDEN)
      Channel.getOrCreate({type: Channel.MAIN, owner: user.id},
                          {model: Channel.MODEL, access: access, name: c.name,
                           url: Channel.makeUrl(user.username, c.slug)}, 
                          user.id, flow.join(user))
    },
    function(user, channel) {
      User.update(user.id, {blog: channel && channel.id}, this)
    },
    function(userId) {
      User.get(userId, this)
    }
  ], done)
}
