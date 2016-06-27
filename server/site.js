var Site = require('../config/site')

module.exports = function(opts) {
  return new Site(Object.assign({}, opts || {}))
}



