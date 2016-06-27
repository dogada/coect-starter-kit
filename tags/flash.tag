<coect-flash class="hide">
  <div class="coect-flash" onclick={ dismiss }>
    <div class="alert alert-{ type }" role="alert">
      <span>{ message }</span>
    </div>
  </div>


  <script>
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
  </script>

  <style scoped>
   :scope {
     display: block;
     position: fixed;
     left:0;
     right:0;
     width: 62%;
     margin-left:auto;
     margin-right:auto;
     z-index: 2000;
     overflow: hidden;
   }
   .alert {
     padding: 5px;
   }
  </style>

</coect-flash>

