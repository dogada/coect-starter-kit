const TABLE = 'entity'

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable(TABLE, function (t) {
      t.specificType('id', 'character varying(126) COLLATE \"C\"').primary()
      // depends on app: channel, entry
      t.string('model', 126)
      // depends on model: channel,community,post,comment,reply,review,checklist
      t.string('type', 126).notNullable()
      t.string('owner', 126)
      // user.id for a list, list.id for a post, post.id for a comment
      // post for a comment, comment for a reply
      t.string('parent', 126)
      // an optional user id to which entity addressed somehow, usually parent.owner 
      t.string('recipient', 126)

      t.integer('child_count').defaultTo(0).notNullable()
      t.integer('like_count').defaultTo(0).notNullable()

      t.string('url', 126).unique()
      // optional source url for webmentions and other foreign entities
      t.string('source')
      // domain of source url or NULL for local entities
      t.string('domain')

      // optional target url for webmentions and other foreign entities
      t.string('target')
      // optional original id for a repost or like link
      t.string('ref', 126)
      t.string('ref_model', 126)
      // reletion between owner and ref
      t.string('rel', 126)


      t.text('text')
      // optinal dictionary meta-information encoded with !key: value
      t.json('meta', true)
      // short name without html formating for usage in links, document.title,
      // notifications, etc
      t.string('name', 126).notNullable()
      // head of entity in wpml-format for usage in list context 
      t.text('head')
      t.json('tags', true) // optional ['tag1', 'tag2']
      // 0 - only admins have access (even owner doesn't have it)
      t.integer('access').defaultTo(0).notNullable()
      // channel owner can limit access in OWN channel only for users with a tag
      // for example, blog owner can limit access to some posts (and comments)
      // for Family only
      t.string('access_tag', 126)
      t.timestamp('created', true).defaultTo(knex.raw('now()')).notNullable()
      // ISO date of last edition, ISO date of channel update or hexdigest of content
      t.string('version', 126)
      // // optional user-defined due date for the entity
      // t.timestamp('due', true)
      // // optional app-depended state (done, cancel, true, false)
      // t.string('state', 126)
      // ------- list specific field
      // replace with data.{list,topic,thread}???
      t.string('list', 126)
      t.string('topic', 126)
      t.string('thread', 126)

      // optional count.{up,down,repost,save,}
      t.json('count', true).notNullable().defaultTo('{}')
      // count.up - count.down or other approach
      t.float('rating').defaultTo(0.0)

      // link with an external data (webmention, reply, etc)
      t.json('link', true)
      // additional data, repost.id, etc caches, etc 
      // data.repost = {id: 23@server.com}
      t.json('data', true).notNullable().defaultTo('{}')

    }).then(function() {
      return knex.schema.raw('create index entity_list_id_idx on "entity" (list, id desc) where list is not null;')
    }).then(function() {
      return knex.schema.raw('create index entity_list_owner_id_idx on "entity" (list, owner, id desc) where list is not null;')
    }).then(function() {
      return knex.schema.raw('create index entity_topic_id_idx on "entity" (topic, id desc) where topic is not null;')
    }).then(function() {
      return knex.schema.raw('create index entity_topic_rating_idx on "entity" (topic, rating desc) where topic is not null;')
    }).then(function() {
      return knex.schema.raw('create index entity_thread_id_idx on "entity" (thread, id asc) where thread is not null;')
    }).then(function() {
      return knex.schema.raw('create index entity_parent_id_idx on "entity" (parent, id desc) where parent is not null;')
    }).then(function() {
      // requires btree_gin extension installed on the PostgreSQL database
      return knex.schema.raw('create index entity_list_tags_idx on "entity" using gin (list, tags jsonb_path_ops) where tags is not null')
    })
  ])
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(TABLE)  
}
