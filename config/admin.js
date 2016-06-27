var debug = require('debug')('site:admin')
var riot = require('riot')
var pages = require('../node_modules/coect-admin/pages')
var apiClasses = require('../node_modules/coect-admin/api')
var coect = require('coect')

function page(path, view) {
  return {path, view, aside: 'admin-sidebar'}
}

function mergePages() {
  return pages.concat([
    page('users', 'account-admin-userlist')
  ])
}

exports.init = function({site, route, server}) {
  debug('init')
  const apis = coect.Api.makeApis({classes: apiClasses, opts: {server, site}})
  const app = Object.assign({
    url: site.urls.admin,
  }, apis)
  riot.mixin('coect-admin', {app, api: app.api})
  coect.ui.routePages({pages: mergePages(), route, site, url: app.url})
  return app
}

