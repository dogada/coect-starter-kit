'use strict';

var gulp = require('gulp')
var browserSync = require('browser-sync')

gulp.task('browser-sync', function () {
  var files = [
    'public/dist/main.js',
    'views/**/*.ejs',
    '!**/*_flymake.js',
    '!**/.*'
  ]

  browserSync.init(files, {
    proxy: 'http://loc.mysite.com:3000',
    port: 4000,
    reloadDelay: 200,
    // don't start browser automatically
    open: false,
    // don't send click from one browser to other to avoid issues with likes on/off
    ghostMode: false
  })
})

