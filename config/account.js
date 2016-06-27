var debug = require('debug')('site:account')
var riot = require('riot')
var coect = require('coect')
var account = require('coect-account')


// ---------------- Backward compatibility
function profilePhoto(photos, size) {
  return size >= 64 && photos.large ||
    size > 24 && size < 64 && photos.normal ||
    size > 16 && size <= 24 && (photos.mini || photos.normal) ||
    size <= 16 && (photos.micro || photos.mini || photos.normal) ||
    photos.original
}

function avatar (user, size) {
  if (user.profile && user.profile.photos && user.profile.photos.normal) return profilePhoto(user.profile.photos, size)
  else return user.avatar || ('/_static/img/avatar_' + (size || 32) + '.png')
}

exports.init = function({site, route, server}) {
  debug('init')
  const app = Object.assign({
    url: site.urls.account,
    avatar
  }, account.initApi({server, site}))
  
  riot.mixin('coect-account', {app})
  coect.ui.routePages({url: app.url, pages: account.pages, route, site})
  return app
}
