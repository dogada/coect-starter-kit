var debug = require('debug')('site:umedia')
var coect = require('coect')
// FIX: refactor to extend coect.Access and use same policy on client and server

exports.canPost = function(channelId) {
  // FIX get by AJAX and cache all channels users can post to
  // || Site.user && Site.user.blog === channelId
  return Site.user && Site.user.admin
}

exports.canComment = function(entry) {
  // allow all logged users to comment
  return !!Site.user
}

function userId(userOrId) {
  return (userOrId && userOrId.id) || userOrId
}

exports.canChangeEntry = function(entry) {
  if (!Site.user) return false
  debug('canChange', Site.user, entry.owner)
  return Site.user.id === userId(entry.owner) || Site.user.admin && !entry.owner
}

exports.canModerateEntry = function(entry) {
  if (!Site.user || Site.user.id === entry.owner) return false
  return (Site.user.admin || Site.user.id === userId(entry.recipient))
}

exports.canBroadcast = function(entry) {
  debug('canBroadcast', Site.user, entry.owner, entry.access, entry.list)
  if (entry.access < coect.Access.EVERYONE) return false
  var listOwnerId = userId(entry.list && entry.list.owner)
  return listOwnerId && Site.user && Site.user.id === listOwnerId
}



