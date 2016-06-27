<site-layout>
  <!-- site-layout tag -->

  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
      <site-navbar></site-navbar>
      
    </div>
  </nav>
  
  <coect-flash></coect-flash>
  
  
  <div class="container container--main">
    <div class="row">
      <div class="col-sm-8 page-content">
        <riot-mount name={ page.main || page.tag || page.view } data={ page.data.main }/>
      </div>
      <div class="col-sm-4 page-sidebar">
        <riot-mount name={ page.aside } data={ page.data.aside }/>
      </div>
    </div>
    
  </div>
  
  <footer class="footer">
    <div class="container">
      <p class="text-muted">&copy; 2016 mysite.com<br>
        Powered by <a id="footer-coect" href="http://www.coect.net/">Coect communication platform</a>.
      </p>

      <p if={ Site.debug }>
        <small>view: { page.view }, main: { page.main }, aside: { page.aside }.</small>
      </p>

    </div>

  </footer>

  
  <script>
   var self = this
   debug('site-layout init', self.site, 'document', (typeof document), (typeof window))
   debug('site-layout state', self.site.state)
   self.on('update', function() {
     self.page = self.site.state.page
     debug('site-layout on update', self.page)
   })
  </script>
</site-layout>
