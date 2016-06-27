

exports.up = function(knex, Promise) {
  return Promise.all([
    //knex.raw('SET foreign_key_checks = 0;'),

    knex.schema.raw('CREATE OR REPLACE FUNCTION update_modified_column()\n' +
                   'RETURNS TRIGGER AS $$\n' +
                   'BEGIN\n' +
                   'NEW.modified = now();\n' +
                   'RETURN NEW;\n' +
                   'END;\n' +
                   '$$ language \'plpgsql\';'),

    knex.schema.createTable('users', function (t) {
      t.specificType('id', 'character varying(126) COLLATE \"C\"').primary()
      t.string('username', 50).unique()
      t.string('name', 126).defaultTo('').notNullable()
      // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
      t.string('avatar', 2000)
      t.string('blog', 126)
      t.string('about', 1000).defaultTo('')
      t.string('location', 126).defaultTo('')
      // 0 - only admins have access (even owner doesn't have it)
      t.integer('access').defaultTo(0).notNullable()

      t.string('email', 126).defaultTo('')
      t.string('password', 100).defaultTo('').notNullable()
      t.json('profile', true).notNullable().defaultTo('{}')
      t.json('groups', true)
      t.string('resetPasswordToken', 100)
      t.dateTime('resetPasswordExpires', true)
      t.json('services', true).defaultTo('[]').notNullable().index('user_services', 'GIN')
      
      t.json('data', true).notNullable().defaultTo('{}')
      t.timestamp('created', true).defaultTo(knex.raw('now()')).notNullable()
      t.timestamp('modified', true)
      //t.index('data', 'users_data', 'GIN')
    }).then(function() {
      return knex.schema.raw('create index user_data on "users" using GIN (data jsonb_path_ops)')
    }).then(function() {
      return knex.schema.raw('CREATE TRIGGER update_user_modified BEFORE UPDATE ON \"users\" FOR EACH ROW EXECUTE PROCEDURE  update_modified_column()')
    })
    
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
}
