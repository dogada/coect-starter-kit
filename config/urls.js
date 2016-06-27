'use strict';

var debug = require('debug')('site:urls')
//FIX: use join only
var path = require('path')

/**
   Build full url from path fragments.
   @param {(string|string[]} path or path fragments
   @params {object} [query] Query string part
   @return {string} Full url.
*/
function urlBuilder(base, translator) {
  return function(obj) {
    if (typeof obj === 'undefined') return base
    var parts = [base]
    for (let i=0, arg; (arg = arguments[i++]); ) parts.push(translator(arg))
    debug('url', base, parts, '->')
    var res = path.join.apply(path, parts)
    return res
  }
}

/**
   Append prefix to base path if first argument isn't object with custom url (or
   username).
*/
function prefixOrUrl(base, prefix) {
  return function(obj) {
    var args = Array.prototype.slice.apply(arguments)
    if (!obj || (!obj.username && !(obj.url && obj.url.charAt(0) !== '!'))) args.unshift(prefix)
    else if (obj.url && /^http[s]?:\/\/.+/.test(obj.url)) {
      return obj.url
    }
    return base.apply(base, args)
  }
}

function urlIdTranslator(obj) {
  var value = (obj.url && obj.url.charAt(0) !== '!' ? obj.url : obj.username || obj.id || obj)
  // coerce numbers to string automatically
  if (typeof value === 'number') value = value.toString(10)
  if (typeof value !== 'string') console.error(
    'Resolved url fragment isn\'t a string: ', value, ', source: ', obj)
  return value
} 


function identityTranslator(obj) {
  return obj
}

function profilePhoto(photos, size) {
  return size >= 64 && photos.large ||
    size > 24 && size < 64 && photos.normal ||
    size > 16 && size <= 24 && (photos.mini || photos.normal) ||
    size <= 16 && (photos.micro || photos.mini || photos.normal) ||
    photos.original
}

function avatarUrl(user, size) {
  if (user.profile && user.profile.photos && user.profile.photos.normal) return profilePhoto(user.profile.photos, size)
  else return user.avatar || ('/_static/img/avatar_' + (size || 32) + '.png')
}

var base = urlBuilder('/', urlIdTranslator)

module.exports = {
  base: base,
  entry: prefixOrUrl(base, 'e'),
  channel: prefixOrUrl(base, 'c'),
  user: prefixOrUrl(base, 'u'),
  category: prefixOrUrl(base, 't'),
  
  auth: urlBuilder('/api/account/auth/', identityTranslator),
  account: urlBuilder('/me/', identityTranslator),
  my: urlBuilder('/my/', identityTranslator),
  admin: urlBuilder('/a/', identityTranslator),

  accountApi: urlBuilder('/api/account/', identityTranslator),
  coreApi: urlBuilder('/api/core/', identityTranslator),

  avatar: avatarUrl
}
