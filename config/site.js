'use strict';

var debug = require('debug')('config:site')
var coect = require('coect')
var Site = coect.Site

// add readonly shortcuts Site.user and Site.debug 
for (let prop of ['user', 'debug']) {
  Object.defineProperty(Site.prototype, prop, {
    get: function() {
      return this.state[prop]
    }
  })
}

//----------------- backward compatibility for old umedia ----------

/**
   Return NodeJs style callback that calls Site.error on error or `fn` otherwise.
*/
Site.prototype.coect = coect

// ---------------- backward compatibity
function mountTo(place, data, title) {
  var site = window.Site
  debug('mountToBridge', place, data)
  if (place === 'main') {
    site.update({
      page: {
        view: data.tag,
        main: data.tag, 
        data: {main: data.data},
        title: title || 'mysite.com'
      }
    })
  } else {
    // backward compatibility, inject aside into current page
    coect.object.assign(site.state.page, {
      aside: data.tag,
    })
    site.state.page.data.aside = data.data
    site.root.update()
  }
}

Site.prototype.mountTag = function(tag, data, opts) {
  mountTo(opts.target || 'main',
          {tag: tag, data: data || {}},
          (opts || {}).title)
}

Site.prototype.checkMount = Site.prototype.mountTag

function mount(data, title) {
}

Site.prototype.mount = function(data, title) {
  debug('Site.mount title=', title)
  if ($.isPlainObject(data)) {
    $.each(data, function(place, comp) {
      mountTo(place, comp, title)
    })
  } else {
    mountTo('main', data, title)
  }
}


Site.prototype.get = () => null


module.exports = Site
