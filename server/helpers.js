var _ = require('lodash')
var path = require('path')
var url = require('url')
var assets = {}

var config = require('./config/')

function makeProdPath(p) {
  var ext = path.extname(p)
  return path.join(
    path.dirname(p),
    path.basename(p, ext) + '.min' + ext)
}

try {
  assets = require('./assets.json')
} catch (e) {
  console.warn('Can\'t load server/assets.json: ', e)
}
/**
   Return static url of an asset.
*/
exports.asset = function(devPath, prodPath) {
  var p = devPath
  if (process.env.NODE_ENV !== 'development') {
    if (prodPath) p = prodPath
    else if (prodPath !== false) p = makeProdPath(devPath)
    p = assets[p] || p
  }
  return url.resolve(config.assets.url, p)
}

exports.jsScriptEscape = require('secure-filters').jsObj
