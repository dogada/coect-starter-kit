function getErrorMessage(err) {
  if ($.isArray(err) && err.length && err[0].msg) return err[0].msg
  return err.msg || err.message || '' + err
  
}

Site.on('coect:error', function(err) {
  console.error('on error', err, err.stack)
  Site.flash(getErrorMessage(err), 'danger')
})
