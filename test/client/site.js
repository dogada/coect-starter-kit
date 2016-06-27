describe('mysite.com', function() {
  it('should work!', function() {
    expect(true).equal(true)
  })
})


describe('global Site', function() {
  it('Site.version should be available', function() {
    expect(Site).keys('version', 'account')
  })

  it('Site.account.avatar', function() {
    expect(Site.account.avatar()).equal('/_static/img/avatar_32.png')
    expect(Site.account.avatar(64)).equal('/_static/img/avatar_64.png')
  })

})

