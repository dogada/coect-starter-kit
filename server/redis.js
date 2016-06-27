var config = require('./config')

module.exports = require('ioredis')({
  db: config.redis.db
})

