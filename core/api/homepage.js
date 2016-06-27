const Api = require('coect').Api

module.exports = class HomepageApi extends Api {
  
  overview(tag) {
    this.getState(tag, 'homepage/overview')
  }
}
