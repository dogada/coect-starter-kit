<site-index>
  <coect-h1>Mysite title</coect-h1>

  <h2>Top tags</h2>
  <coect-taglist tags={ state.tags } />

  <h2>Last users</h2>
  <account-userlist users={ state.users } />

  <script>
   var tag = this
   tag.mixin('site-core')
   debug('site-index opts.state', tag.opts.state)
   debug('site-index tag.state', tag.state)
   debug('site-index app', tag.app)
   if (!tag.getState() && tag.app) tag.app.homepage.overview(tag)
  </script>
  
</site-index>
