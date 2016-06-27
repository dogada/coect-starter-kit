'use strict';

var request = require('supertest')
var app = require('../../server/app')

function get(url, status) {
  it('GET ' + url, function(done) {
    request(app).get(url).expect(status || 200, done)
  })
}

describe('GET of main pages', function() {
  this.timeout(10*1000)
  get('/')
  get('/api/account/auth/login')
  get('/api/account/auth/register')
  get('/user/blog/nopost', 404)

  get('/me/')

  get('/a/', 403)
  get('/a/error/throw', 403)
  get('/a/error/send', 403)

})

