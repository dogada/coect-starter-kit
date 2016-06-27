var debug = require('debug')('site:routes')
var page = require('page')
var site = require('./site')
var umedia = require('coect-umedia')



module.exports = function(urls) {
  debug('init')

  umedia.routes(page, {
    slug: true, 
    newspaper: false,
    url: urls
  })

  site.init({route: page}) //should be last because it defines default '*' route

  // should be bind after all apps (like admin) will be loaded
  Site.notfound = (ctx) => {
    //Site.error('404: ' + ctx.path + ' is not found.')
    Site.mountTag(
      'site-error', 
      {code: 404,
       message: 'Not found',
       details: 'Path: ' + ctx.path}, 
      {title: '404: Not found'})
  }
  debug('init Site.notfound', Site.notfound)
}
