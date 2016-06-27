var {ui, Store} = require('coect')

class SiteStore extends Store {
}

module.exports = {
  site: new SiteStore(),
  admin: new Store()
}
