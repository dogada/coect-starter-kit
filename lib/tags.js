
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('site-about', '<h2>About</h2> <p>This is starter kit for Coect-powered web-sites.</p>', '', '', function(opts) {
});

riot.tag2('coect-breadcrumbs', '<nav class="coect-breadcrumbs" role="navigation" aria-label="breadcrumbs"> <ol class="breadcrumb" itemscope itemtype="http://schema.org/BreadcrumbList"> <li each="{item, i in opts.items}" class="{active: !item.url}" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"> <a if="{item.url}" href="{item.url}" itemprop="item" class="disabled-h-breadcrumb"> <span itemprop="name">{item.name}</span> </a> <strong if="{!item.url}">{item.name}</strong> <meta itemprop="position" content="{i + 1}"> </li> </ol> </nav>', '', '', function(opts) {
});

riot.tag2('coect-bridgy-config', '<div style="display: none"> <a href="https://brid.gy/publish" class="{classes}"></a> <a if="{coect.bool(meta.facebook)}" href="https://brid.gy/publish/facebook" rel="nofollow"></a> <a if="{coect.bool(meta.twitter)}" href="https://brid.gy/publish/twitter" rel="nofollow"></a> <a if="{coect.bool(meta.instagram)}" href="https://brid.gy/publish/instagram" rel="nofollow"></a> <a if="{coect.bool(meta.flickr)}" href="https://brid.gy/publish/flickr" rel="nofollow"></a> <p if="{meta.twitter_content}" class="p-bridgy-twitter-content">{meta.twitter_content}</p> <p if="{meta.facebook_content}" class="p-bridgy-facebook-content">{meta.facebook_content}</p> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   self.meta = opts.meta

   function bridgy(prop) {
     return self.coect.bool(self.meta.bridgy) && self.meta.bridgy.indexOf(prop) > -1
   }

   if (self.meta) {
     self.classes = (bridgy('omit-link') ? 'u-bridgy-omit-link' : '')
     if (bridgy('ignore-formatting')) self.classes += 'u-bridgy-ignore-formatting'
   }
});
      

riot.tag2('coect-category-detail', '<div class="coect-category-detail"> <coect-breadcrumbs if="{breadcrumbs}" items="{breadcrumbs}"></coect-breadcrumbs> <umedia-channel channel="{opts.category}"></umedia-channel> <umedia-entry-list filters="1" if="{query.list}"></umedia-entry-list> <p if="{!query.list}">No entries are found for the tag.</p> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   debug('category_detail', opts)
   var opts = self.opts, channel = opts.channel, category = opts.category
   self.query = {}
   self.items = opts.items || []
   self.tabs = [
     {id: 'top', name: 'Top', url: ''},
     {id: 'last', name: 'Last'}
   ]

   if (typeof Site !== 'undefined' && Site.user) {
     self.tabs.push({id: 'my', name: 'My'})
   }

   function setTab(tab) {
     self.tab = tab
     if (tab == 'my') {
       self.coect.object.assign(self.query, {
         order: 'last',
         owner: opts.owner || Site.user && Site.user.id,
         tag: category.name,
         list: channel && channel.id
       })
     } else if (channel) {
       self.coect.object.assign(self.query, {
         order: tab,
         owner: undefined,
         list: channel.id,
         tag: category.name
       })
     } else {
       self.coect.object.assign(self.query, {
         order: tab,
         list: category.id,
         owner: undefined,
         tag: undefined
       })
     }
   }

   setTab(opts.tab || self.tabs[0].id)

   self.on('tab:changed', function(tab) {
     debug('tab:changed', tab)
     setTab(tab)
     self.trigger('query:changed')
   })

   if (channel) self.breadcrumbs = [
     {name: channel.owner.name, url: self.url.user(channel.owner)},
     {name: channel.name, url: self.url.channel(channel)}
   ]

});

riot.tag2('umedia-channel', '<div class="umedia-channel"> <h1 class="top-header">{name}</h1> <div class="wpml"> <umedia-wpml text="{channel.text}"></umedia-wpml> </div> <entity-footer entity="{channel}" change="{canChange}"></entity-footer> </div>', '', '', function(opts) {
var self = this;
self.mixin('umedia-context');
self.channel = self.opts.channel;
self.name = self.channel.name;
if (self.channel.type == 'category') self.name = '#' + self.name;
if (typeof Site !== 'undefined' && Site.umedia) self.canChange = Site.umedia.canChangeEntry(self.channel);
});

riot.tag2('umedia-channel-admin', '<div class="umedia-channel-admin"> <table class="table table-hover"> <tr each="{items}"> <td>{name}</td> <td> <a href="{parent.url.channel()}/{id}/edit" title="Edit"> <span class="fa fa-pencil" aria-hidden="true"></span> </a> </td> <td> <a href="./" onclick="{parent.remove}" title="Remove"> <span class="fa fa-remove" aria-hidden="true"></span> </a> </td> </tr> </table> <div> <a class="btn btn-primary" role="button" href="{url.channel(\'_/new\')}">New</a> </div> </div>', '', '', function(opts) {
var self = this;
this.mixin('umedia-context');

self.reload = function () {
  self.store.channel.get(self.url.channel(), { owner: Site.user.id }, Site.callback(function (data) {
    self.items = data.items;
    self.update();
  }));
};

self.remove = function (e) {
  self.store.channel.del(self.url.channel(e.item.id), Site.callback(self.reload));
};

self.reload();
});

riot.tag2('umedia-channel-details', '<div class="umedia-channel-detail"> <coect-breadcrumbs items="{breadcrumbs}"></coect-breadcrumbs> <umedia-channel channel="{channel}"></umedia-channel> <umedia-entry-editor if="{permissions.post}" ancestor="{channel}" items="{items}"></umedia-entry-editor> <umedia-entry-list ancestor="{channel}"></umedia-entry-list> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   debug('channel_details')
   var channel = self.channel = self.opts.channel
   self.permissions = self.opts.permissions || {}
   self.items = self.opts.entries || []
   self.query = {parent: channel.id}
   self.breadcrumbs = [
     {name: channel.owner.name, url: self.url.user(channel.owner)}
   ]
});

riot.tag2('umedia-channel-editor', '<div class="umedia-channel-editor"> <form onsubmit="{save}" method="POST"> <div class="form-group"> <label>Name <small>(max length 50 chars)</small></label> <input type="text" class="form-control" name="name" placeholder="Channel name"> </div> <div class="form-group"> <label>Description</label> <textarea name="text" class="form-control"></textarea> </div> <div class="form-group"> <button type="submit" class="btn btn-primary">Save</button> <button type="button" class="btn btn-danger" onclick="{cancel}">Cancel</button> </div> </form> </div>', 'umedia-channel-editor .umedia-channel-editor,[riot-tag="umedia-channel-editor"] .umedia-channel-editor,[data-is="umedia-channel-editor"] .umedia-channel-editor{ margin-top: 10px; }', '', function(opts) {
   var self = this
   this.mixin('umedia-context')
   debug('channel editor', self.opts)

   self.cancel = function(e) {
     if (Site.page.len) Site.page.back()
     else Site.page.show('/')
   }

   self.save = function(e) {
     debug('save name', self.cname, self)
     e.preventDefault()
     self.store.channel.save(self.url.channel(), {
       id: self.opts.id,
       name: self.name.value,
       text: self.text.value
     }, Site.callback(function(data) {
         Site.page(self.url.channel(data))
       }))
   }

   self.load = function(id) {
     self.store.channel.get(self.url.channel(id, 'data'), Site.callback(function(data) {
       self.name.value = data.name
       self.text.value = data.text
       debug('loaded channel', data, self.name.value)
       self.update()
     }))
   }

   if (self.opts.id) self.load(self.opts.id)

});

riot.tag2('coect-channel-feed', '<div if="{items.length}" class="coect-channel-feed"> <h4>{opts.name || \'Channels\'} ({items.length})</h4> <ul class="list-unstyled"> <li each="{c in items}"> <a href="{url.channel(c)}">{c.name || \'Blog\'}</a> </li> </ul> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   self.items = opts.items || []
});

riot.tag2('site-debug', '<p>Site.version: {Site.version}</p> <p>Site.csrfToken: {Site.csrfToken}</p> <p>meta csrf-token: {$(\'meta[name=\\⁗csrf-token\\⁗]\').attr(\'content\')}</p>', '', '', function(opts) {
});


riot.tag2('entity-footer', '<div class="entity-footer"> <aside class="coect-meta"> <span class="{active-tab: showLikes}"> <coect-like-button entity="{entity}"></coect-like-button> </span> <span if="{opts.comments}"> <a href="{url.entry(entity)}" title="Comments"><i class="comments fa fa-comments"></i> {entity.child_count || ⁗⁗}</a> </span> <span if="{opts.replyToUrl}"> <a href="{opts.replyToUrl}" class="u-in-reply-to" title="In reply to"><i class="fa fa-external-link-square"></i></a> </span> <span if="{entity.meta}"> <a if="{entity.meta.facebook_url}" class="u-syndication" rel="syndication" href="{entity.meta.facebook_url}"><i class="fa fa-facebook"></i></a> <a if="{entity.meta.twitter_url}" class="u-syndication" rel="syndication" href="{entity.meta.twitter_url}"><i class="fa fa-twitter"></i></a> <a if="{entity.source}" class="u-syndication" rel="syndication" title="Source url" href="{entity.source}"><i class="fa fa-{sourceIcon(source)}"></i></a> </span> <span if="{opts.broadcast}"> <a href="#" onclick="{broadcast}">Broadcast</a> </span> <span if="{opts.change}"> <a href="{entityUrl(entity.id, \'edit\')}">Edit</a> </span> <span class="pull-right"> <coect-save-button entity="{entity}"></coect-save-button> </span> </aside> <div if="{showLikes}" class="like-list"> <ul class="list-inline"> <li each="{like in likes}"> <a href="{url.user(like.owner)}"> <img class="media-object" width="32" height="32" alt="{like.owner.name}" title="{like.owner.name}" riot-src="{url.avatar(like.owner, 32)}"> </a> </li> </ul> </div> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   self.entity = opts.entity
   if (self.entity) self.entityUrl = (self.entity.model == 'channel' ? self.url.channel : self.url.entry)
   debug('entity-footer', self.entity && self.entity.meta)

   self.sourceIcon = function(url) {
     if (/^https?:\/\/twitter.com/.test(url)) return 'twitter'
     if (/^https?:\/\/(\w+\.)?facebook.com/.test(url)) return 'facebook'
     return 'external-link'
   }

   self.broadcast = function(e) {
     self.store.entry.post(self.url.entry(self.entity.id, 'broadcast'), Site.callback(function(data) {
       debug('broadcasted', data)
       self.entity.meta = self.coect.object.assign({}, self.entity.meta || {}, data.meta)
       Site.flash(JSON.stringify(data.meta || 'Broadcasted'))
       self.parent.update()
     }))
   }

});

riot.tag2('umedia-entry', '<div id="e{entry.id}" class="{\'h-entry\': hentry, \'h-cite\': opts.cite, \'p-comment\': opts.comment, \'highlighted\': entry.highlighted, \'media umedia-entry\': 1}"> <h1 if="{title && opts.detail}" class="p-name">{title}</h1> <div class="media-left"> <a class="p-author h-card" href="{url.user(entry.owner)}"> <img class="media-object" width="32" height="32" alt="{entry.owner.name}" title="{entry.owner.name}" riot-src="{url.avatar(entry.owner, 32)}"> </a> </div> <div class="media-body"> <aside class="entry-header coect-meta"> <a class="umedia-display-name" href="{url.user(entry.owner)}" title="{entry.owner.username || entry.owner.id}">{displayName(entry.owner)}</a> <span if="{action}">{action}</span> <a if="{objectUrl}" href="{objectUrl}">{objectName || \'Noname\'}</a> <a class="u-url permalink" href="{url.entry(entry)}" title="{createdLocaleStr}"><time class="dt-published" datetime="{createdISOStr}">{createdAgeStr} ago</time></a> <span if="{entry.access == Access.MODERATION}" onclick="{moderate}" class="restricted" title="The entry is awaiting for moderation.">moderation</span> <span if="{entry.access == Access.REJECTED}" class="restricted" title="The entry was rejected after moderation.">rejected</span> <span if="{entry.access == Access.HIDDEN}" class="restricted" title="The entry is visible to owner and admins only.">hidden</span> <span if="{isRestricted(entry)}" class="restricted" title="Access to the entry is restricted (level: {entry.access}).">restricted</span> </aside> <h2 if="{title && !opts.detail}"><a class="p-name" href="{url.entry(entry)}">{title}</a></h2> <article class="entry-content {(hentry || opts.detail) ? \'e-content\': \'p-content\'}"> <umedia-wpml doc="{doc}"></umedia-wpml> </article> <div if="{title && entry.tags && !detail}" class="entry-tags"> <ul class="list-inline"> <li each="{t, i in entry.tags}"> <a href="{url.category(t)}" class="p-category">#{t}</a> </li> </ul> </div> <div if="{showReadMore}" class="coect-meta read-more"> <a href="{url.entry(entry)}">Read more…</a> </div> <p if="{entry.model == \'repost\' && !entry.name}" class="coect-meta">Referenced entry <a href="{url.entry(entry.ref)}">{entry.ref}</a> was not found or deleted. </p> <entity-footer if="{entry}" entity="{entry}" change="{canChange}" comments="{hasCounters}" reply-to-url="{replyToUrl}" broadcast="{canBroadcast}" meta="{meta}"></entity-footer> <coect-bridgy-config if="{coect.bool(meta.bridgy)}" meta="{meta}"></coect-bridgy-config> </div> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   var opts = self.opts
   var Access = self.Access = require('coect').Access
   self.ancestor = self.opts.ancestor
   var entry = self.entry = self.opts.entry || self.opts.state &&
   self.opts.state.entry

   self.hentry = opts.hentry || (!opts.cite && !opts.comment && !opts.detail)
   debug('h-entry', self.hentry, 'cite=', opts.cite, 'comment', opts.comment, 'detail=', opts.detail, entry)

   function yourType() {
     return (Site.user && Site.user.id === entry.recipient ? ' your ' + entry.type : '')
   }

   self.actionName = function() {

     if (entry.model === 'like') return (entry.access == Access.HIDDEN ? 'saved': 'liked') + yourType()
     else if (entry.model === 'repost') return 'reposted' + yourType()
     else if (entry.type === 'comment' || entry.type === 'reply' || self.replyToUrl) return 'to'
     else if (entry.type === 'bookmark') return 'bookmarked' + yourType()
     else if (entry.type === 'rsvp') return 'rsvp'
     else if (entry.type === 'mention') return 'mentioned'
     else if (entry.type === 'link' || entry.type === 'webmention') return 'mentioned'
     return ''
   }

   function initHeader() {
     self.action = self.actionName()
     if (entry.ref) {
       self.objectUrl = self.url.entry(entry.ref)
       self.objectName = entry.name
     } else if (entry.type == 'post' && self.replyToUrl) {
       self.objectUrl = self.replyToUrl
       self.objectName = self.meta.reply_to_name || self.coect.util.truncateUrl(self.replyToUrl)
     } else if (entry.type == 'reply' || entry.type == 'comment') {
       self.objectUrl = self.url.entry(entry.parent)
       self.objectName = self.meta.reply_to_name
     } else if (opts.list_name) {
       self.objectUrl = self.url.entry(entry.channel)
       self.objectName = entry.list.name
     } else if (entry.source && entry.link.target) {
       self.objectUrl = entry.source
       debug('entry.source', entry.source)
       self.objectName = self.coect.util.truncateUrl(entry.link.target)
     }

     if (entry.created) {

       var d = new Date(self.webmention && self.webmention.published || entry.created)
       self.createdLocaleStr = d.toLocaleString()
       self.createdISOStr = d.toISOString()
       self.createdAgeStr = self.getAge(d)
     }
   }

   function initContent() {
     var hasContent = entryMeta.p_count === undefined || entryMeta.p_count > 0
     var content = (self.summaryView ? entry.head : entry.text) || entry.head || entry.name || ''
     if (entry.ref) content = ''
     self.doc = self.wpml.doc(content)
     self.title = self.doc.meta.title || entryMeta && entryMeta.title
     self.showReadMore = self.summaryView && entry.text && (entryMeta.p_count === undefined || entryMeta.p_count > 1)
   }

   if (entry) {
     var entryMeta = entry.meta || {}
     self.meta = self.coect.object.assign(
       {}, entry.list && entry.list.meta || {}, entryMeta)
     debug('entry meta', entry.name, self.meta)
     self.source = entry.source
     self.webmention = entry.source && entry.link
     self.replyToUrl = self.meta.reply_to || entry.parent && entry.parent.source
     self.summaryView = (opts.view === 'summary')
     debug('summaryView', self.summaryView)
     initContent()
     initHeader()
     self.hasCounters = (entry.model == 'entry')
     debug('counters', self.hasCounters, 'action', self.action,
           'objectUrl', self.objectUrl, 'replyTo', self.replyToUrl)
   }

   self.isRestricted = function(entry) {
     if ([Access.MODERATION, Access.REJECTED,
     Access.HIDDEN].indexOf(entry.access) !== -1) return false
     if (self.ancestor && self.ancestor.access) return entry.access < self.ancestor.access
     return entry.access !== Access.EVERYONE
   }

   self.displayName = function(user) {
     return user.name || 'Noname'
   }

   self.expand = function(e) {
     var div = $(e.target).parents('.umedia-entry')[0] || $(e.target)
     if (!$(div).hasClass('umedia-compacted')) return true
     $(div).removeClass('umedia-compacted')
     return false
   }

   self.commentsLabel = function(entry) {
     if (!entry.child_count) return 'Reply'
     else return 'Replies (' + entry.child_count + ')'
   }

   self.moderate = function(e) {
     if (!Site.umedia.canModerateEntry(e)) return
     if (!(e.ctrlKey || e.altKey || e.metaKey || e.shiftKey)) return
     self.debug('moderate access=', self.entry.access, 'alt=', e.altKey,
                'meta=', e.metaKey, 'ctrl=', e.ctrlKey, 'shift=', e.shiftKey, 'name=', self.entry.name)
     self.store.entry.moderate(self.entry, e.ctrlKey, Site.callback(
       function(data) {
         self.update({entry: $.extend(self.entry, data)})
       }
     ))
   }

   if (entry && typeof window !== 'undefined') {
     self.canChange = Site.umedia.canChangeEntry(self.entry)
     self.canBroadcast = Site.umedia.canBroadcast(self.entry)
   }
});

riot.tag2('umedia-entry-details', '<div class="umedia-entry-details h-entry"> <coect-breadcrumbs if="{breadcrumbs.length}" items="{breadcrumbs}"></coect-breadcrumbs> <umedia-entry if="{cite}" entry="{cite}" cite="1" class="p-in-reply-to"></umedia-entry> <umedia-entry entry="{entry}" detail="1"></umedia-entry> <p if="{entry.type == \'reply\'}">View <a href="{url.entry(entry.thread)}">all replies</a> in the thread. </p> <umedia-entry-editor if="{permissions.comment}" ancestor="{entry}" items="{items}"></umedia-entry-editor> <div class="login-required" hide="{Site.user}"> Please <a onclick="{Site.account.loginRequired}">sign in</a> to add a comment or a reply. </div> <umedia-entry-list id="umedia-comments" ancestor="{entry}" comment="1" cite="1" view="full"></umedia-entry-list> </div>', '', '', function(opts) {
 var self = this
 self.mixin('umedia-context')
 var entry = self.entry = self.opts.entry

 function getThreadId(entry) {
   return (entry.thread && entry.thread.id !== entry.topic.id ? entry.thread.id : entry.id)
 }

 function getTopicId(entry) {
   return entry.topic && entry.topic.id || entry.id
 }

 function getListType(ancestor) {
   if (ancestor.model === 'channel') return 'channel'
   else if (!ancestor.thread) return 'topic'
   else if (ancestor.thread && ancestor.thread.id === ancestor.topic.id) return 'thread'
   else if (ancestor.thread) return 'replies'
 }

 var query = self.query = {order: 'last', view: 'full'}
 var listType = getListType(entry)
 if (listType === 'topic') query.topic = getTopicId(entry)
 else if (listType === 'thread') query.thread = getThreadId(entry)
 else if (listType === 'replies' || listType === 'channel') query.parent = entry.id

 debug('initQuery listType', listType, entry, query)

 function flat() {
   debug('flatMode', query)
   if (!query.thread) return
   delete query.thread
   query.topic = getTopicId(entry)
   self.mode = 'flat'
   self.trigger('query:changed')
 }

 function threaded() {
   debug('threadedMode', query)
   if (!query.topic) return
   delete query.topic
   query.thread = getThreadId(entry)
   self.mode = 'threaded'
   self.trigger('query:changed')
 }

 if (entry.parent && entry.topic && entry.parent.id !== entry.topic.id) self.cite = entry.parent
 self.permissions = opts.permissions || {}
 self.items = []
 self.tabs = [
   {id: 'last', name: 'Last'},
   {id: 'first', name: 'First'},
   {id: 'top', name: 'Top'}
 ]

 if (entry.type == 'post') {
   self.modes = [
     {id: 'flat', name: 'Flat view', icon: 'fa fa-align-justify', handler: flat},
     {id: 'threaded', name: 'Threaded view', icon: 'fa fa-indent', handler: threaded},
   ]
   self.mode = self.modes[0].id
 }

 self.on('tab:changed', function(tab) {
   debug('tab:changed', tab)
   self.query.order = tab
   self.trigger('query:changed')
 })

 self.breadcrumbs = opts.breadcrumbs || [
   {name: entry.list.owner.name, url: self.url.user(entry.list.owner)},
   {name: entry.list.name, url: self.url.channel(entry.list)},
 ]
 if (entry.topic && entry.topic.name && self.breadcrumbs && self.breadcrumbs.length) {
   self.breadcrumbs.push({
     name: self.coect.util.truncate(entry.topic.name, 40),
     url: self.url.entry(entry.topic)})
 }

});

riot.tag2('umedia-entry-editor', '<div class="{umedia-entry-editor: 1, expanded: expanded}"> <h2 if="{opts.query}">Create new entry</h2> <h2 if="{opts.entry}">Edit entry</h2> <form onsubmit="{publish}" method="POST"> <div show="{opts.channels && opts.channels.length > 1}" class="form-group"> <label>Channel</label> <select class="form-control" id="channel"> <option each="{c in opts.channels}" value="{c.id}">{c.name}</option> </select> </div> <div class="form-group"> <label if="{opts.entry || opts.channels}">Text</label> <textarea rows="1" name="content" class="form-control" placeholder="Type your {entryType()} here" onfocus="{expand}" onkeyup="{edit}"></textarea> </div> <div if="{expanded}" class="form-inline form-group clearfix"> <div class="form-group pull-right"> <button type="submit" class="btn btn-success">Publish</button> <button if="{!opts.thread}" type="button" class="btn btn-danger" onclick="{cancel}">Cancel</button> </div> </div> </form> <div if="{opts.bmName}"> <p>Drag and drop bookmarklet link shown bellow to the bookmarks toolbar of your browser.</p> <h3><a title="Drag and drop me to the bookmarks toolbar" href="{opts.bmUrl}">{opts.bmName}</a></h3> <p>When you select text on any web-page and click the bookmarklet, your browser will be redirected back to this page and selected text will be prepopulated in the above textarea. <small><a href="https://en.wikipedia.org/wiki/Bookmarklet">More info</a></small> </p> </div> </div>', 'umedia-entry-editor .umedia-entry-editor,[riot-tag="umedia-entry-editor"] .umedia-entry-editor,[data-is="umedia-entry-editor"] .umedia-entry-editor{ margin-top: 10px; }', '', function(opts) {

var self = this,
    opts = self.opts;
self.mixin('umedia-context');
var entry = opts.entry;
var ancestor = opts.ancestor;
var items = opts.items;

debug('editor entry=' + entry + ', items=' + items);
debug('editor ancestor', ancestor, 'channels', opts.channels, 'query', opts.query);

function getQueryText(q) {
  return (q.text || '') + ' ' + (q.url || '');
}

function setText(text) {
  self.text = self.content.value = text;
}

self.expand = function (e) {
  self.content.style.height = '300px';
  self.expanded = true;
};

self.collapse = function () {
  self.expanded = false;
  self.content.style.height = 'auto';
};

self.entryType = function () {
  switch ((entry || ancestor || {}).model) {
    case 'channel':
      return 'post';
    default:
      return 'text';
  }
};

self.edit = function (e) {
  self.text = e.target.value;
};

self.cancel = function (e) {
  if (Site.page.len) Site.page.back();else Site.page.show('/');
};

function published(doc) {
  console.log('done', doc, items);
  self.text = self.content.value = '';
  doc.highlighted = true;
  if (items) {
    items.splice(0, 0, doc);
    self.collapse();
    self.parent.update();
  } else {
    Site.page(self.url.entry(doc));
  }
}

self.publish = function (e) {
  e.preventDefault();
  var parent = ancestor && ancestor.id || self.channel && self.channel.value;
  var list = ancestor && (ancestor.list && ancestor.list.id || ancestor.id) || parent;
  console.log('Publish', this.text, self.opts, self.channel);
  self.store.entry.save(self.url.entry(), { id: entry && entry.id,
    text: self.content.value,
    parent: parent, list: list }, Site.callback(published));
};

var initialText = entry && entry.text || opts.query && getQueryText(opts.query);
if (initialText) {
  setText(initialText);
  self.expand();
}
});

riot.tag2('coect-entry-feed', '<div if="{items.length}" class="coect-entry-feed"> <ul class="list-unstyled h-feed"> <li each="{e in items}" class="h-entry"> <a href="{url.entry(e)}" class="u-url p-name">{e.name}</a> </li> </ul> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   self.items = opts.items || []
});

riot.tag2('umedia-entry-list', '<div class="umedia-entry-list"> <div if="{tabs.length && (items.length || opts.filters)}" class="clearfix"> <ul class="nav nav-tabs pull-left"> <li each="{t in tabs}" class="{active(tab == t.id)}"> <a onclick="{changeTab}" href="#" title="{t.title || \'\'}">{t.name || t.id}</a> </li> </ul> <div if="{parent && parent.modes}" class="btn-group pull-right" role="group" aria-label="View mode"> <button each="{m in parent.modes}" type="button" class="btn btn-default {active(m.id == parent.parent.mode)}" onclick="{m.handler}" title="{m.name}"><i class="{m.icon}"></i></button> </div> </div> <div if="{items.length}"> <ul class="{\'entries h-feed\': 1, \'p-comments\': opts.comment,           \'list-unstyled\': entryItem, \'list-inline category-list\': !entryItem}"> <li each="{e in (entryItem ? items : [])}"> <umedia-entry entry="{e}" ancestor="{parent.ancestor || parent.channel}" comment="{parent.opts.comment}" cite="{parent.opts.cite}" view="{parent.view}"></umedia-entry> </li> <li each="{e in (categoryItem ? items : [])}"> <a href="{url.category(e.name)}">#{e.name}</a> </li> <li each="{e in (userItem ? items : [])}"> <coect-user-channel user="{e.owner}"></coect-user-channel> </li> </ul> <div if="{hasMore}"> <a href="#" onclick="{more}">Load more</a> </div> </div> </div>', '', '', function(opts) {
   var self = this

   self.mixin('umedia-context')
   self.debug('entry_list window=', typeof window, self.opts)

   var opts = self.opts
   self.ancestor = opts.ancestor
   self.items = opts.items || self.parent && self.parent.items || []
   self.hasMore = !opts.frozen
   self.view = opts.view || 'summary'
   self.tabs = self.parent && self.parent.tabs || []
   self.tab = opts.tab || self.tabs.length && self.tabs[0].id
   self.query = opts.query || self.parent && self.parent.query || {}

   if (!self.query.count) self.query.count = parseInt(opts.count || 10, 10)

   function setItem(tab) {
     self.categoryItem = self.userItem = self.entryItem = false
     if (self.tab == 'category') self.categoryItem = true
     else if (self.tab == 'user') self.userItem = true
     else  self.entryItem = true
   }

   setItem(self.tab)
   debug('initial query', self.query, 'items.length=', self.items.length)
   debug('tabs', self.tabs)
   debug('parent', self.parent)
   debug('modes', self.parent && self.parent.modes)

   function clearItems() {
     self.items.splice(0, self.items.length)
   }

   self.changeTab = function(e) {
     clearItems()
     self.tab = e.item.t.id
     setItem(self.tab)
     self.parent.trigger('tab:changed', self.tab, e)
   }

   self.active = function(test) {
     return (test ? ' active' : '')
   }

   function getCursor() {
     if (self.query.order === 'top') return {offset: self.items.length}
     else return {cursor: self.items[self.items.length - 1].id}
   }

   function getQuery(append) {
     return (append ? $.extend(getCursor(), self.query) : self.query)
   }

   self.rebuild = function(data) {
     self.hasMore = (data.length >= self.query.count)
     debug('rebuild', data.length, self.hasMore)
   }

   function load(append) {
     debug('load', append)
     self.store.entry.get(self.url.entry(''), getQuery(append), Site.callback(function(data) {
       debug('loaded data', data.items && data.items.length + ', requested ', self.query.count)

       if (!append) clearItems()
       self.items.push.apply(self.items, data.items)
       self.rebuild(data.items)
       self.update()
     }))
   }

   self.more = function() {
     debug("more entries.length=", self.items.length);
     load(true)
   }

   if (self.parent) self.parent.on('query:changed', function() {
     load()
   })

   if (typeof window !== 'undefined') self.on('mount', function() {
     if (!self.items.length) load()
     else self.rebuild(self.items)
     self.update()
   })

});

riot.tag2('umedia-entry-name', '<div id="e{entry.id}" class="umedia-entry-name media"> <div class="media-left"> <a href="{url.user(entry.owner)}"> <img class="media-object" width="24" height="24" title="{entry.owner.name || entry.owner.username || entry.owner.id}" riot-src="{url.avatar(entry.owner, 24)}" alt=""> </a> </div> <div class="media-body"> <a href="{url.entry(entry)}">{entry.name}</a> </div> </div>', '', '', function(opts) {
   var self = this
   self.entry = opts.entry
   self.fullDate = function(d) {

     return d && new Date(d).toLocaleString() || d
   }
});

riot.tag2('site-error', '<div class="site-error"> <h2>Error {opts.code}: {opts.message}</h2> <p>{opts.details}</p> </div>', '', '', function(opts) {
});

riot.tag2('coect-flash', '<div class="coect-flash" onclick="{dismiss}"> <div class="alert alert-{type}" role="alert"> <span>{message}</span> </div> </div>', 'coect-flash,[riot-tag="coect-flash"],[data-is="coect-flash"]{ display: block; position: fixed; left:0; right:0; width: 62%; margin-left:auto; margin-right:auto; z-index: 2000; overflow: hidden; } coect-flash .alert,[riot-tag="coect-flash"] .alert,[data-is="coect-flash"] .alert{ padding: 5px; }', 'class="hide"', function(opts) {
   var self = this
   self.mixin('coect-context', 'umedia-context')
   debug('flash.tag init', self)
   self.type = 'info'
   self.timeout = opts.timeout || 3000

   self.dismiss = function() {
     $(self.root).addClass('hide')
   }

   self.show = function(message, type, timeout) {
     debug('flash.tag show', type, message)

     self.message = message
     self.type = type || 'info'
     $(self.root).removeClass('hide')
     if (self.timer) clearTimeout(self.timer)
     self.timer = setTimeout(self.dismiss, timeout || self.timeout)
     self.update()
   }

   if (self.site.on) self.site.on('coect:flash', self.show)
});


riot.tag2('coect-h1', '<h1><yield></yield></h1>', '', '', function(opts) {
   var tag = this
   tag.mixin('site-context')
   debug('coect-h1', tag.root)
   tag.on('mount', function() {
     debug('h1 mount', tag.root)
     var h1 = tag.root.firstChild
     debug('coect-h1 mount', h1.innerHTML, 'tag.site', !!tag.site)
     tag.site.setPageTitle(h1.innerHTML)
   })
});

riot.tag2('coect-head', '', '', '', function(opts) {
   var tag = this, opts = tag.opts
   debug('coect-head ', opts.title)
   tag.on('*', function(event) {
     debug('coect-head', event, opts.title, tag.isMounted, 'parent.isMounted', tag.parent.isMounted)
   })
   tag.on('mount', function() {
     tag.site.setPageTitle(opts.title)
   })
});

riot.tag2('account-home', '', '', '', function(opts) {
   this.mixin('coect-account')
   debug('account-home')
   const tag = this
   window.setTimeout(() => {
     tag.site.show(tag.site.user ? 'account-usereditor' : 'account-login',
                   'account-sidebar')
   }, 0)
});

riot.tag2('site-index', '<coect-h1>Mysite title</coect-h1> <h2>Top tags</h2> <coect-taglist tags="{state.tags}"></coect-taglist> <h2>Last users</h2> <account-userlist users="{state.users}"></account-userlist>', '', '', function(opts) {
   var tag = this
   tag.mixin('site-core')
   debug('site-index opts.state', tag.opts.state)
   debug('site-index tag.state', tag.state)
   debug('site-index app', tag.app)
   if (!tag.getState() && tag.app) tag.app.homepage.overview(tag)
});

riot.tag2('site-layout', '<nav class="navbar navbar-default navbar-fixed-top"> <div class="container"> <site-navbar></site-navbar> </div> </nav> <coect-flash></coect-flash> <div class="container container--main"> <div class="row"> <div class="col-sm-8 page-content"> <riot-mount name="{page.main || page.tag || page.view}" data="{page.data.main}"></riot-mount> </div> <div class="col-sm-4 page-sidebar"> <riot-mount name="{page.aside}" data="{page.data.aside}"></riot-mount> </div> </div> </div> <footer class="footer"> <div class="container"> <p class="text-muted">&copy; 2016 mysite.com<br> Powered by <a id="footer-coect" href="http://www.coect.net/">Coect communication platform</a>. </p> <p if="{Site.debug}"> <small>view: {page.view}, main: {page.main}, aside: {page.aside}.</small> </p> </div> </footer>', '', '', function(opts) {
   var self = this
   debug('site-layout init', self.site, 'document', (typeof document), (typeof window))
   debug('site-layout state', self.site.state)
   self.on('update', function() {
     self.page = self.site.state.page
     debug('site-layout on update', self.page)
   })
});

riot.tag2('coect-like-button', '<span class="coect-like-button"> <a href="#" onclick="{toggle}" title="Like it!"><i class="{⁗like fa fa-heart⁗: 1, ⁗liked⁗: opts.entity.user_liked}"></i></a> <a if="{opts.entity.like_count}" href="#" onclick="{toggleLikes}">{opts.entity.like_count}</a> </span>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')

   self.toggle = function() {
     var method = (opts.entity['user_liked'] ? 'del' : 'post')
     debug('toggle', method, opts.entity.id)
     if (!Site.user) return Site.account.loginRequired()
     self.store.entry[method](self.url.entry(opts.entity.id, 'like'), Site.callback(
       function(data) {
         $.extend(opts.entity, data)
         self.parent.update({showLikes: false})
       }
     ))
   }

   self.toggleLikes = function(e) {
     self.parent.update({showLikes: !self.parent.showLikes})
     debug('toogleLikes', self.parent.showLikes, self.parent)
     self.store.entry.get(self.url.entry(opts.entity.id, 'likes'), Site.callback(
       function(data) {
         self.parent.update({likes: data.items})
       }
     ))
   }

});

riot.tag2('account-login', '<coect-head title="Log in"></coect-head> <div class="coect-login"> <h1>Log in</h1> <h3>Use social accounts</h3> <ul class="coect-login-social list-inline"> <li><a class="btn btn-primary" rel="external" href="{site.auth.url(\'facebook\')}?next={site.state.returnTo}">Facebook</a></li> <li><a class="btn btn-primary" rel="external" href="{site.auth.url(\'google\')}?next={site.state.returnTo}">Google</a></li> <li><a class="btn btn-primary" rel="external" href="{site.auth.url(\'twitter\')}?next={site.state.returnTo}">Twitter</a></li> </ul> <h3>Have username and password?</h3> <form onsubmit="{login}" method="POST"> <div class="form-group"> <label>Username</label> <input type="text" class="form-control" name="username"> </div> <div class="form-group"> <label>Password</label> <input type="password" class="form-control" name="password"> </div> <div class="form-group"> <button type="submit" class="btn btn-primary">Log in</button> </div> <p>Don&#39;t have an account yet? <a onclick="{showRegister}">Create it now!</a></p> </form> </div>', 'account-login h1,[riot-tag="account-login"] h1,[data-is="account-login"] h1{ margin-bottom: 30px; } account-login .coect-login-social,[riot-tag="account-login"] .coect-login-social,[data-is="account-login"] .coect-login-social{ margin-bottom: 30px; }', '', function(opts) {
   this.mixin('coect-account')
   var tag = this

   $(tag.password).password({
     eyeClass: 'fa',
     eyeOpenClass: 'fa-eye',
     eyeCloseClass: 'fa-eye-slash'
   })

   debug('login returnTo', tag.site.state.returnTo)

   tag.showRegister = function() {
     tag.site.show('account-register')
   }

   tag.login = function(e, data) {
     debug('login', typeof e, e, arguments)
     if (e) e.preventDefault()
     tag.app.auth.login(tag, data || {
       username: tag.username.value,
       password: $(tag.password).password('val')
     })
   }

   tag.on('mount unmount', function() {
     tag.username.value = tag.password.value = ''
   })

   tag.on('*', function(event) {
     debug('login.tag', event, tag.opts)
   })

});

riot.tag2('site-main-sidebar', '<div class="site-main-sidebar"> <div class="sidebar-module sidebar-module-inset"> <site-about></site-about> </div> <div class="sidebar-module"> <coect-channel-feed items="{opts.channels}"></coect-channel-feed> </div> </div>', 'site-main-sidebar .sidebar-module,[riot-tag="site-main-sidebar"] .sidebar-module,[data-is="site-main-sidebar"] .sidebar-module{margin-bottom: 30px}', '', function(opts) {
});

riot.tag2('riot-mount', '', '', '', function(opts) {
   var tag = this
   tag.mixin('site-context')
   tag.mounted = {}
   var EMPTY = {}

   tag.shouldRebuild = function() {
     return (tag.mounted.page !== tag.site.state.page)
   }

   function makeOrphanTag(name, opts) {
     debug('mounting to new div', name, opts)
     var tags = riot.mount(document.createElement('div'), name, opts)
     return (tags.length === 1 ? tags[0] : null)
   }

   function rebuild() {
     const page = tag.site.state.page
     var childName = tag.opts.name
     var childOpts = tag.opts.data || EMPTY
     debug('rebuild ', childName, tag.opts.data, 'mounted', tag.mounted)
     childOpts.site = tag.site

     if (tag.mounted.tag) {
       debug('unmounting', tag.mounted.name)
       tag.mounted.tag.unmount()
       tag.mounted = {}
     }

     var childTag = childName && makeOrphanTag(childName, childOpts)

     if (childTag) {
       tag.root.appendChild(childTag.root)
       tag.mounted = {
         tag: childTag,
         name: childName,
         opts: tag.opts.data,
         page: page}
       debug('mounted', tag.mounted)
     }
   }

   tag.on('update', function() {
     debug('mount.tag update shouldRebuild', tag.shouldRebuild(), ' mounted', tag.mounted)
     if (tag.shouldRebuild()) rebuild()
     var child = tag.mounted.tag
     if (child && (!child.shouldUpdate || child.shouldUpdate())) child.update()
   })

   tag.on('*', function(event) {
     debug('riot-mount', event, tag.opts)
   })
});


riot.tag2('site-navbar', '<ul class="nav navbar-nav navbar-left"> <li> <a href="/" title="Home"> <span class="fa fa-home" aria-hidden="true"></span> </a> </li> <li> <a href="{Site.urls.my()}" title="My likes and bookmarks"> <span class="fa fa-heartbeat" aria-hidden="true"></span> </a> </li> <li> <a href="{Site.urls.my(\'inbox\')}" title="Notifications"> <span class="fa fa-bell" aria-hidden="true"></span> </a> </li> <li> <a href="{Site.urls.entry(\'new\')}" title="Create new entry"> <span class="fa fa-pencil" aria-hidden="true"></span> </a> </li> </ul> <ul class="nav navbar-nav navbar-right"> <li if="{!Site.user}"> <a href="{Site.account.url()}">Log in</a> </li> <li if="{Site.user}" class="dropdown"> <a href="{Site.account.url()}" class="dropdown-toggle" data-toggle="dropdown"> <img width="32" height="32" class="avatar" alt="pic" riot-src="{Site.account.avatar(Site.user, 32)}" title="{Site.user.name || Site.user.username || Site.user.id}"> <i class="caret"></i> </a> <ul class="dropdown-menu"> <li><a href="{Site.urls.user(Site.user)}">Profile</a></li> <li><a href="{Site.account.url()}">Settings</a></li> <li class="divider"></li> <li><a onclick="{logout}">Log out</a></li> </ul> </li> </ul>', 'site-navbar li.dropdown > a,[riot-tag="site-navbar"] li.dropdown > a,[data-is="site-navbar"] li.dropdown > a{ padding: 9px 0; }', '', function(opts) {
   var tag = this
   tag.logout = function() {
     debug('navbar logout')
     tag.site.account.auth.logout(tag)
   }
});


riot.tag2('umedia-profile', '<div> <div class="media vcard"> <div class="media-left"> <a href="{url.user(user)}" class="url"> <img class="media-object photo" width="128" height="128" alt="{user.id}" riot-src="{url.avatar(user, 128)}"> </a> </div> <div class="media-body"> <h1><span class="fn">{user.name || user.id}</span> <small if="{user.username}">@<span class="nickname">{user.username}</span></small> </h1> <entity-footer entity="{user.blog}"></entity-footer> <umedia-wpml class="p-note" text="{user.about}"></umedia-wpml> <p if="{user.location}" class="umedia-location locality">{user.location}</p> </div> </div> <div if="{opts.entries.length}"> <h4 class="coect-section-header">Recent entries</h4> <umedia-entry-list items="{opts.entries}" frozen="true"></umedia-entry-list> </div> </div>', 'umedia-profile h1,[riot-tag="umedia-profile"] h1,[data-is="umedia-profile"] h1{ margin-top: 0; }', 'class="umedia-profile"', function(opts) {
   var self = this
   self.mixin('umedia-context')

   self.user = opts.user
   self.debug('profile', self.url.user, self.url.user(self.user))

});

riot.tag2('umedia-raw', '', '', 'class="umedia-raw"', function(opts) {
   var self = this
   self.mixin('umedia-context')

   function refresh(data) {
     self.root.innerHTML = self.opts.html || ''
   }

   self.on('update', refresh)
   refresh()
});

riot.tag2('account-register', '<coect-head title="Sign up"></coect-head> <div class="coect-register"> <h1>Sign up</h1> <form onsubmit="{register}" method="POST"> <div class="form-group"> <label>Username (latin chars and digits only)</label> <input type="text" class="form-control" name="username"> </div> <div class="form-group"> <label>Password (min length 8 chars)</label> <input type="password" class="form-control" name="password"> </div> <div class="form-group"> <button type="submit" class="btn btn-primary">Sign up</button> </div> <p>Already have an account? <a onclick="{showLogin}">Log in now!</a></p> </form> </div>', '', '', function(opts) {
   var tag = this
   tag.mixin('coect-context', 'coect-account')

   $(tag.password).password({
     eyeClass: 'fa',
     eyeOpenClass: 'fa-eye',
     eyeCloseClass: 'fa-eye-slash',
   })

   tag.showLogin = function() {
     tag.site.show('account-login')
   }

   tag.register = function(e) {
     e.preventDefault()
     tag.app.auth.register(tag, {
       username: tag.username.value,
       password: $(tag.password).password('val')
     })
   }

   tag.on('mount unmount', function() {
     tag.password.value = ''
   })

   tag.on('*', function(event) {
     debug('register.tag', event, tag.opts)
   })

});

riot.tag2('coect-save-button', '<span class="coect-save-button"> <a href="#" onclick="{toggle}" title="Bookmark it!"><i class="{⁗fa fa-bookmark⁗: 1,  ⁗saved⁗: opts.entity.user_saved}"></i></a> </span>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')

   self.toggle = function() {
     var method = (opts.entity['user_saved'] ? 'del' : 'post')
     if (!Site.user) return Site.account.loginRequired()
     self.store.entry[method](self.url.entry(opts.entity.id, 'save'), Site.callback(
       function(data) {
         $.extend(opts.entity, data)
         self.parent.update({showLikes: false})
       }
     ))
   }
});

riot.tag2('account-sidebar', '<ul class="list-unstyled"> <li><a href="{app.url()}">Settings</a></li> </ul>', '', '', function(opts) {
   this.mixin('coect-account')
});

riot.tag2('coect-taglist', '<ul if="{opts.tags}" class="coect-taglist list-inline h-feed category-list"> <li each="{c in opts.tags}"> <a href="{url.category(c.name)}">#{c.name}</a> </li> </ul>', '', '', function(opts) {
   var tag = this
   tag.mixin('umedia-context')
});

riot.tag2('coect-user-channel', '<div class="coect-user-channel thumbnail with-caption"> <a href="{url.user(user)}" title="{user.name}"> <img class="photo" width="128" height="128" alt="{user.id}" riot-src="{url.avatar(user, 128)}"> </a> <p> <a href="{url.user(user)}">{user.name}</a> </p> </div>', '', '', function(opts) {
var self = this;
self.mixin('umedia-context');
self.user = self.opts.user;
});

riot.tag2('coect-user-likes', '<div class="coect-user-likes"> <umedia-entry-list tab="{tab}" filters="1"></umedia-entry-list> </div>', '', '', function(opts) {
   var self = this
   self.mixin('umedia-context')
   var opts = self.opts, channel = opts.channel
   debug('user_likes', opts)

   self.items = opts.items || []
   self.tabs = [
     {id: 'entry', name: 'Entries', title: 'Liked and saved entries'},
     {id: 'category', name: 'Tags', icon: 'hashtag'},
     {id: 'user', name: 'People'}
   ]
   self.tab = opts.tab || self.tabs[0].id
   self.query = {my: 'main', filter: self.tab}

   self.on('tab:changed', function(tab) {
     debug('tab:changed', tab)
     self.query.filter = tab
     self.trigger('query:changed')
   })
});

riot.tag2('account-usereditor', '<div class="coect-profile"> <coect-h1>Edit profile</coect-h1> <form id="profile" method="POST" onsubmit="{save}"> <div class="form-group" if="{user.admin}"> <label>Email</label> <input class="form-control" name="email" value="{user.email || \'\'}" type="{\'email\'}"> </div> <div class="form-group"> <label>Username <small>(can not be changed)</small></label> <input type="text" class="form-control" name="username" value="{user.username || \'\'}" __disabled="{user.username}"> </div> <div class="form-group"> <label>Name</label> <input type="text" class="form-control" name="name" value="{user.name || \'\'}"> </div> <div class="form-group"> <label>Location</label> <input type="text" class="form-control" name="location" value="{user.location || \'\'}"> </div> <div class="form-group"> <label>About (links are clickable)</label> <textarea class="form-control" name="about" rows="5" value="{user.about || \'\'}"></textarea> </div> <div class="form-group"> <label>Picture</label><br> <img width="128" height="128" class="avatar" alt="avatar" riot-src="{site.account.avatar(user, 64)}" title="{user.name || user.username}"> </div> <div class="form-group"> <button type="submit" class="btn btn-primary">Update Profile</button> </div> </form> </div>', '', '', function(opts) {
   this.mixin('coect-context', 'coect-account')
   var tag = this
   tag.fields = ['email', 'name', 'location', 'about', 'username']
   debug('usereditor', tag.site)
   tag.user = tag.opts.user || tag.site && tag.site.user

   function select(obj, keys, fn) {
     var res = {}
     $.each(keys, function(i, key) {
       res[key] = (fn ? fn(obj[key]) : obj[key])
     })
     return res
   }

   tag.save = function(e) {
     debug('save')
     e.preventDefault()
     const form = select(tag, tag.fields, field => field.value)
     tag.app.profile.update(tag, form)
   }
});

riot.tag2('account-userlist', '<div class="coect-user-list"> <ul class="list-inline"> <li each="{u in opts.users}"> <div class="media"> <div class="media-left"> <img class="media-object pull-left" width="32" height="32" alt="{u.id}" riot-src="{site.urls.avatar(u, 32)}"> </div> <div class="media-body"> <a href="{site.urls.user(u)}">{u.name || u.id}</a> <span if="{u.username}">(@{u.username})</span> </div> </div> </li> </ul> </div>', '', '', function(opts) {
   this.mixin('coect-account')
});

riot.tag2('umedia-wpml', '', '', 'class="wpml"', function(opts) {
   var self = this
   this.mixin('umedia-context')

   function rebuild() {
     self.debug('wpml.rebuild')
     if (self.opts.doc) self.doc = self.opts.doc
     else if (self.opts.text) self.doc = self.wpml.doc(self.opts.text)

     if (self.doc) self.root.innerHTML = self.doc.html
   }

   this.on('mount', rebuild)
});
});