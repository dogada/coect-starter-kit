var path = require('path')
var _ = require('lodash')

var SITE_PATH = '/srv/config/mysite_site'

var env = (process.env.NODE_ENV || 'development')

console.log('loading config files for env=', env)

function loadIfExist(path) {
  try {
    return require(path)
  } catch(e) {
    console.error('Can\'t load ', path, e)
    return {}
  }
}

var mergedConfig = _.merge(
  {},
  loadIfExist('./common'),
  loadIfExist('./' + env),
  // owerwrite default settings with secrets settings
  loadIfExist(path.join(SITE_PATH, 'common')),
  loadIfExist(path.join(SITE_PATH, env))
)

module.exports = mergedConfig
