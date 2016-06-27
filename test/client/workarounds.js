// PhantomJS before 2.0 have issue with Function.prototype.bind 
// https://github.com/teampoltergeist/poltergeist/issues/292#issuecomment-77668648
if (typeof Function.prototype.bind === 'undefined') {
  Function.prototype.bind = function(target) {
    var f = this
    return function() {
      return f.apply(target, arguments)
    }
  }
}
