<coect-head>
  <script>
   var tag = this, opts = tag.opts
   debug('coect-head ', opts.title)
   tag.on('*', function(event) {
     debug('coect-head', event, opts.title, tag.isMounted, 'parent.isMounted', tag.parent.isMounted)
   })
   tag.on('mount', function() {
     tag.site.setPageTitle(opts.title)
   })
  </script>
</coect-head>
