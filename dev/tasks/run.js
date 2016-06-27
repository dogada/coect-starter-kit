'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon')

gulp.task('nodemon', function () {
  nodemon({
    script: 'bin/www',
  }).on('restart', function () {
    console.log('Server restarted!')
  })
})
