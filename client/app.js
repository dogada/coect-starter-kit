'use strict';

var debug = require('debug')('site:main')
var page = require('page')
var riot = require('riot')
var coect = require('coect')

var MallpingSite = require('../config/site')

var site = window.Site = new MallpingSite({state: window.__INITIAL_STATE__ || {}}) //singletone for client app

require('debug').enable(site.debug)
site.version = '__VERSION__'
debug('app site.version', site.version, 'riot.version', riot.version)

jQuery.extend(site, require('./config'))
site.api = require('./site').api


if (site.riotDebug) riot.util.tmpl.errorHandler = function(err) { 
  console.error('Riot template error:', err) 
}

// make routing available for all components
window.page = site.page = page
site.access = coect.Access

var ui = require('coect').ui
require('./bootstrap')

var urls = Site.urls = require('../config/urls')
site.server = new coect.SiteAjaxServer({
  base: urls.base,
  site: site
})

Site.umedia.url = urls

require('../config/riot')

var core = require('../config/core')
site.core = core.init({
  site: site, 
  route: page,
  server: new coect.AjaxServer({base: urls.coreApi})
})

var account = require('../config/account')
site.account = account.init({
  site: site, 
  route: page,
  server: new coect.AjaxServer({base: urls.accountApi})
})

var admin = require('../config/admin')
site.admin = admin.init({
  site: site, 
  route: page,
  server: new coect.AjaxServer({base: urls.admin})
})


Site.auth = {}
Site.auth.url = urls.auth
Site.account.url = urls.account



// compile tags to javascript and embed
require('../config/tags')

require('./errors')


// backward compatibility
Site.on('update', function() {
  debug('Site.update')
  riot.update()
})

Site.callback = function(fn) {
  return function(err, ...rest) {
    if (err) return Site.error(err)
    fn(...rest)
  }
}

module.exports = {riot: riot, page: page, urls: urls}
