var riot = require('riot')
var coect = require('coect')
var umedia = require('coect-umedia')
var urls = require('./urls')


// make debug available in tags
// FIX replace with self.debug
var debug = global.debug = require('debug')('root')

// register coect-* helpers
coect.mixins.register()



umedia.riot.init({
  url: urls,
  store: umedia.store,
  debug: require('debug')('umedia:tag')
})

riot.mixin('site-context', {})
riot.mixin('site-core', {})
riot.mixin('coect-account', {})


/**
   Get site instance from opts or parent tag.
*/
riot.mixin({
  init: function() {
    const tag = this
    tag.resolveSite()
    // save snapshop of site page in init time
    if (tag.site) tag.page = tag.site.state.page

    tag.getStateId = function() {
      return tag.opts.dataIs
    }
    debug('site-context mixin', tag.getStateId())

    tag.getState = function() {
      debug('tag.getState', tag.getStateId())
      return tag.site.getState(tag.getStateId())
    }

    tag.setState = function (state) {
      debug('tag.setState', tag.getStateId())
      tag.site.setState(tag.getStateId(), state, tag)
    }

    tag.shouldUpdate = function() {
      return (!tag.state || tag.state !== tag.getState())
    }

    tag.on('update', function() {
      debug('mixin update', tag.getStateId(), ', state:', tag.state)
      tag.state = tag.getState()
      debug('mixin new state', tag.state)
    })

    // tag.shouldGetState = function() {
    //   return tag.app && tag.app.getState && tag.getStateUrl
    // }

    // get initial state from opts if it's provided (usually by server)
    if (tag.opts.state) tag.setState(tag.opts.state)
    //else if (!tag.getState() && tag.shouldGetState()) tag.app.getState(tag)
  },
  resolveSite: function() {
    const tag = this, opts = tag.opts
    tag.site = opts.site || (tag.parent && tag.parent.site)
    if (!tag.site) console.warn('No site in', tag)
  }
})
