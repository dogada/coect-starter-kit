'use strict';

var path = require('path');
var config = require('./config/')
var debug = require('debug')('site:db')

var knexConfig = require('./knexfile')[process.env.NODE_ENV]
var knex = require('knex')(knexConfig)
var orm = require('coect').orm

var User = require('coect-account').User
var umedia = require('coect-umedia').models

// use same id generator for all models 
const edid = require('edid')({
  epoch: require('coect').EPOCH
})

debug('Unsing edid', edid)

// FIX after migration to Query
for (let model of [orm.Model, User, umedia.Entity, umedia.Entity, umedia.Channel]) model.raw = knex.raw.bind(knex)

debug('Model.raw', orm.Model.raw)
debug('-------Entry.raw', umedia.Entry.raw)


User.configure((id) => knex('users'), edid)
umedia.Entity.configure((id) => knex('entity'), edid)
umedia.Entry.configure((id) => knex('entity'), edid)
umedia.Channel.configure((id) => knex('entity'), edid)




module.exports = {
  knex: knex,
  User: User,
  Entity: umedia.Entity,
  Channel: umedia.Channel,
  Entry: umedia.Entry,
  admin: [User, umedia.Channel, umedia.Entry]
}
