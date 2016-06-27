var debug = require('debug')('site:account')
var riot = require('riot')
var apiClasses = require('../core/api')
var pages = require('../core/pages')
var coect = require('coect')

exports.init = function({site, route, server}) {
  debug('init')
  const apis = coect.Api.makeApis({classes: apiClasses, opts: {server, site}})
  const app = Object.assign({
    url: site.urls.base,
  }, apis)
  riot.mixin('site-core', {app})
  coect.ui.routePages({url: app.url, pages, route, site})
  return app
}
