'use strict';


/**
   Load all required components.
*/

const USE_COMPILED = process.env.NODE_ENV && process.env.NODE_ENV !== 'development'

if (USE_COMPILED) {
  require('../lib/tags.js')
} else {
  require('../tags/navbar.tag')

  require('../tags/layout.tag')
  require('../tags/index.tag')
  require('../tags/about.tag')
  require('../tags/mainsidebar.tag')
  require('../tags/error.tag')
  require('../tags/debug.tag')

  require('../tags/head.tag')
  require('../tags/h1.tag')
  require('../tags/mount.tag')

  
  require('../tags/flash.tag')

  require('../node_modules/coect-account/tags/home.tag')
  require('../node_modules/coect-account/tags/sidebar.tag')
  require('../node_modules/coect-account/tags/login.tag')
  require('../node_modules/coect-account/tags/register.tag')
  require('../node_modules/coect-account/tags/usereditor.tag')
  require('../node_modules/coect-account/tags/userlist.tag')

  require('../node_modules/coect-umedia/client/tags/profile.tag')

  require('../node_modules/coect-umedia/client/tags/raw.tag')
  require('../node_modules/coect-umedia/client/tags/wpml.tag')
  
  require('../node_modules/coect-umedia/client/tags/channel.tag')
  require('../node_modules/coect-umedia/client/tags/channel_feed.tag')
  require('../node_modules/coect-umedia/client/tags/channel_details.tag')
  require('../node_modules/coect-umedia/client/tags/channel_admin.tag')
  require('../node_modules/coect-umedia/client/tags/channel_editor.tag')
  
  require('../node_modules/coect-umedia/client/tags/entry.tag')
  require('../node_modules/coect-umedia/client/tags/entry_list.tag')
  require('../node_modules/coect-umedia/client/tags/entry_details.tag')
  require('../node_modules/coect-umedia/client/tags/entry_editor.tag')
  require('../node_modules/coect-umedia/client/tags/entry_name.tag')
  require('../node_modules/coect-umedia/client/tags/entry_feed.tag')

  require('../node_modules/coect-umedia/client/tags/breadcrumbs.tag')
  require('../node_modules/coect-umedia/client/tags/category_detail.tag')
  require('../node_modules/coect-umedia/client/tags/bridgy_config.tag')

  require('../node_modules/coect-umedia/client/tags/save_button.tag')
  require('../node_modules/coect-umedia/client/tags/like_button.tag')
  require('../node_modules/coect-umedia/client/tags/entity_footer.tag')
  require('../node_modules/coect-umedia/client/tags/user_channel.tag')
  require('../node_modules/coect-umedia/client/tags/user_likes.tag')
  require('../node_modules/coect-umedia/client/tags/taglist.tag')
}

