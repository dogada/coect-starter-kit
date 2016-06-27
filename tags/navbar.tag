
<site-navbar>
  <ul class="nav navbar-nav navbar-left">
    <li>
      <a href="/" title="Home">
        <span class="fa fa-home" aria-hidden="true"></span>
      </a>
    </li>
    
    <li>
      <a href={ Site.urls.my() } title="My likes and bookmarks">
        <span class="fa fa-heartbeat" aria-hidden="true"></span>
      </a>
    </li>
      
    <li>
      <a href={ Site.urls.my('inbox') } title="Notifications">
        <span class="fa fa-bell" aria-hidden="true"></span>
      </a>
    </li>

    <li>
      <a href={ Site.urls.entry('new') } title="Create new entry">
        <span class="fa fa-pencil" aria-hidden="true"></span>
      </a>
    </li>
      
  </ul>

  <ul class="nav navbar-nav navbar-right">
    <li if={ !Site.user }>
      <a href={ Site.account.url() }>Log in</a>
    </li>
    <li if={ Site.user } class="dropdown">
      <a href="{ Site.account.url() }" 
         class="dropdown-toggle" data-toggle="dropdown">
        <img width="32" height="32" class="avatar"
             alt="pic"
             src="{ Site.account.avatar(Site.user, 32) }"
             title="{ Site.user.name || Site.user.username || Site.user.id }">
        <i class="caret" />
      </a>

      <ul class="dropdown-menu">
        <li><a href={ Site.urls.user(Site.user) }>Profile</a></li>
        <li><a href={ Site.account.url() }>Settings</a></li>
        <li class="divider"></li>
        <li><a onclick={ logout }>Log out</a></li>
      </ul>
    </li>
  </ul>

  <style scoped>
   li.dropdown > a {
     padding: 9px 0;
   }
  </style>

  <script>
   var tag = this
   tag.logout = function() {
     debug('navbar logout')
     tag.site.account.auth.logout(tag)
   }
  </script>
</site-navbar>

