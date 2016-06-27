// Update with your config settings.

var _ = require('lodash')
var DB = 'mysite'
var common = {
  client: 'pg',
  connection: {
    database: DB,
    user:     DB,
    password: DB,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations'
  }
  
}

module.exports = {

  development: _.merge(common, {
    pool: {
      min: 2,
      max: 3
    },
  }),

  staging: common,

  production: common

}
