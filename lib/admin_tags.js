
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('admin-dashboard', '<coect-h1>Admin Dashboard</coect-h1> <table class="table"> <caption>Data types overview</caption> <tr> <th>Model</th> <th>Type</th> <th>Count</th> <th>Last record</th> </tr> <tr each="{row in state.stat}"> <td><a href="{Site.urls.admin(row.model)}">{row.model}</a></td> <td><a href="{rowUrl(row)}">{row.type}</a></td> <td>{row.count}</td> <td title="{row.last_created}">{row.last_created && Site.coect.date.diff(row.last_created)}</td> </tr> </table>', '', '', function(opts) {
   var tag = this, site = tag.site
   debug('dashboard')
   tag.mixin('coect-admin')

   tag.rowUrl = function(row) {
     if (row.model == 'user') return tag.app.url('user')
     else return tag.app.url(row.model, row.type)
   }

   tag.app.api.getState(tag, 'dashboard')
});

riot.tag2('admin-entrylist', '<coect-breadcrumbs if="{breadcrumbs.length}" items="{breadcrumbs}"></coect-breadcrumbs> <umedia-entry-list></umedia-entry-list>', '', '', function(opts) {
   this.mixin('coect-admin')
   var tag = this, params = tag.page.params
   tag.query = {type: params.type, model: params.model}

   tag.breadcrumbs =[
     {name: 'Dashboard', url: tag.app.url()},
     {name: params.model, url: tag.app.url(params.model)}
   ]
   if (params.type) tag.breadcrumbs.push({name: params.type})
});

riot.tag2('admin-sidebar', '<ul class="list-unstyled"> <li><a href="{site.urls.admin()}">Dashboard</a></li> <li><a href="{site.urls.admin(\'users\')}">Users</a></li> <li><a href="{site.urls.admin(\'users\')}">Channels</a></li> <li><a href="{site.urls.admin(\'tasks\')}">Tasks</a></li> </ul>', '', '', function(opts) {
});

riot.tag2('admin-tasklist', '<ul> <li> <a rel="external" target="_blank" href="{app.url(\'webmentionio\', \'check\')}">Check webmention.io</a> </li> <li> <a rel="external" target="_blank" href="{app.url(\'error\', \'exception\')}">Test exception</a> </li> <li> <a rel="external" target="_blank" href="{app.url(\'error\', \'error\')}">Test error</a> </li> </ul>', '', '', function(opts) {
   debug('tasklist')
   this.mixin('coect-admin')
});

riot.tag2('account-admin-userlist', '<coect-h1>User Admin</coect-h1> <account-userlist users="{state.users}"></account-userlist>', '', '', function(opts) {
   this.mixin('coect-account')
   var tag = this
   if (!tag.getState()) tag.app.user.list(tag)
});
});