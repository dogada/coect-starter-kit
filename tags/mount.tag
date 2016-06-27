<riot-mount>

  <script>
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
     childOpts.site = tag.site // FIX: make this.parent as child.parent

     if (tag.mounted.tag) {
       debug('unmounting', tag.mounted.name)
       tag.mounted.tag.unmount() // and remove parent
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
  </script>

</riot-mount>
