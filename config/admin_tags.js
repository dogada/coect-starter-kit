'use strict';

const USE_COMPILED = process.env.NODE_ENV && process.env.NODE_ENV !== 'development'

if (USE_COMPILED) {
  require('../lib/admin_tags.js')
} else {
  require('../node_modules/coect-admin/tags/dashboard.tag')
  //require('../admin/tags/sidebar.tag')
  require('../tags/admin/sidebar.tag')
  require('../node_modules/coect-admin/tags/tasklist.tag')
  require('../node_modules/coect-admin/tags/entrylist.tag')
  // account admin
  require('../node_modules/coect-account/tags/admin/userlist.tag')
}

