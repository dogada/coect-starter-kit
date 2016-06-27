/* jshint expr: true */

var ui = require('coect').ui
var env = require('./env.js')

describe('site tags', function() {
  before(function() {
  })

  it('about.tag should contain D.V.D.', function() {
    var tag = ui.make('site-about')
    expect(tag.root.textContent).contain('D.V.D.')
  })

  it('site-error should show error with code, message and details', function() {
    var tag = ui.make('site-error', {code: 404, message: 'Test', details: 'Info'})
    expect($(tag.root).find('h2').text()).equal('Error 404: Test')
    expect($(tag.root).find('p').text()).equal('Info')
  })

  it('coect-flash.tag should accept timeout', function() {
    expect(ui.make('coect-flash').timeout).equal(3000)
    expect(ui.make('coect-flash', {timeout: 5000}).timeout).equal(5000)
  })

  it('coect-flash.tag should show/hide messages', function() {
    var tag = ui.make('coect-flash')
    expect(tag.show).a('function')
    tag.show('Message')
    expect(!$(tag.root).hasClass('hide')).ok()
    expect($(tag.root).find('div.alert-info span').text()).equal('Message')
    tag.show('Error', 'danger')
    expect($(tag.root).find('div.alert-danger span').text()).equal('Error')
    expect(tag.dismiss).a('function')
    tag.dismiss()
    expect($(tag.root).hasClass('hide')).ok()
  })

  it('navbar.tag should show show left navbar to admins only', function() {
    var tag = ui.make('site-navbar')
    Site.user = null
    expect($(tag.root).find('a[title=\"Messages\"]')).length(0)
    Site.user = {id: '1'}
    tag.update()
    expect($(tag.root).find('a[title=\"Messages\"]')).length(0)
    Site.user = {id: '1', admin: true}
    tag.update()
    expect($(tag.root).find('a[title=\"Messages\"]')).length(1)
  })

  it('navbar.tag should show \"Log in\" for guests', function() {
    var tag = ui.make('site-navbar')
    Site.user = null
    tag.update()
    expect($(tag.root).find('.navbar-right a:contains(\"Log in\")').text()).be('Log in')
    expect($(tag.root).find('.navbar-right a:contains(\"Log out\")').text()).be('')

    Site.user = {id: '1', username: 'dvd'}
    tag.update()
    expect($(tag.root).find('.navbar-right img').hasClass('avatar')).ok()
    expect($(tag.root).find('.navbar-right a:contains(\"Log in\")').text()).be('')
    expect($(tag.root).find('.navbar-right a:contains(\"Profile\")').text()).be('Profile')
    expect($(tag.root).find('.navbar-right a:contains(\"Log out\")').text()).be('Log out')
  })

  it('navbar.tag should show \"Log out\" after login', function() {
    var tag = ui.make('site-navbar')
    Site.user = {id: '1', username: 'dvd'}
    tag.update()
    expect($(tag.root).find('.navbar-right img').hasClass('avatar')).ok()
    expect($(tag.root).find('.navbar-right a:contains(\"Log in\")').text()).be('')
    expect($(tag.root).find('.navbar-right a:contains(\"Profile\")').text()).be('Profile')
    expect($(tag.root).find('.navbar-right a:contains(\"Log out\")').text()).be('Log out')
  })

  it('main-sidebar.tag should show About', function() {
    var tag = ui.make('site-main-sidebar')
    tag.update()
    expect($(tag.root).find('p:contains(\"D.V.D.\")').length).equal(1)
  })

  it('channel-list should show Channels', function(done) {
    var tag = ui.make('umedia-channel-list')

    function checkHtml() {
      //expect($('.umedia-channel-list li', tag.root).length).above(2)
      // $('.umedia-channel-list li', tag.root).should.exist
      // $('.umedia-channel-list a', tag.root).should.contain('Blog') // default name
      // $('.umedia-channel-list a', tag.root).should.contain('Programming')
    }
    tag.on('updated', () => setTimeout(env.tryIt(checkHtml, done), 100))
  })

})

