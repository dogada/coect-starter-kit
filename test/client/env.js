exports.tryIt = function(fn, done) {
  return function() {
    try {
      fn()
      done()
    } catch (e) {
      done(e)
    }
  }
}
