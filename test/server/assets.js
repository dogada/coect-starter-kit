describe('Generated assets.json', function() {
  it('should have correct values', function() {
    var assets = require('../../server/assets')

    expect(assets).property('dist/global_libs.js')
    expect(assets).property('dist/main.min.js')
    expect(assets).property('dist/libs.min.js')

    expect(assets).property('dist/css/bootstrap.min.css')
    expect(assets).property('dist/main.css')
  })
})
