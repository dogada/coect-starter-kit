'use strict';

const api = require('./api')

module.exports = [
  {path: '/homepage/overview', get: api.homepage.overview}
]
