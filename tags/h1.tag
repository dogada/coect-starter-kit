<coect-h1>
  <h1><yield/></h1>
  <script>
   var tag = this
   tag.mixin('site-context')
   debug('coect-h1', tag.root)
   tag.on('mount', function() {
     debug('h1 mount', tag.root)
     var h1 = tag.root.firstChild
     debug('coect-h1 mount', h1.innerHTML, 'tag.site', !!tag.site)
     tag.site.setPageTitle(h1.innerHTML)
   })
  </script>
</coect-h1>
