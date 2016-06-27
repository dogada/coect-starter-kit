var path  = require('path')

var DAY_MS = 24 * 60 * 60 * 1000

var INDEX = 2 // index on the server

module.exports = {
  port: 3100 + INDEX * 10,
  redis: {
    db: INDEX
  },

  secrets: require('./secrets'),
  passport: {},
  umedia: {
    // what show on homepage: all users post, single user or single list
    // for user or list can be used defaults.user or defaults.list or first
    // created user or list
    main: 'all', // all, user, list
    sidebar: 'blogs', // 'user', 'blogs',
    // 'community' allows everyone to post, in blog mode only admin can post by default 
    mode: 'community' 
  },

  community: true,
  blog: false,
  defaults: {
    host: 'mysite.com',
    url: 'https://mysite.com',
    channel: {
      slug: 'blog',
      name: 'Blog'
    }
  },
  session: {
    cookie: {
      name: 'sid',
      maxAge: 31 * DAY_MS
    }
  },
  auth: {
    groups: {
      admins: 'admins'
    }
  },
  assets: {
    url: '/_static/'
  },
  debug: {
    client: 'root,site:*,-site:urls,auth:*,-site:routes,coect:*,ui:*,umedia:*,admin:*,account:*'
  },
  analytics: false
}
