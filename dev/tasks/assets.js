'use strict';

var gulp = require('gulp')
var hash = require('gulp-hash')

gulp.task('assets-manifest', function () {
  return gulp.src('public/**/*.*')
    .pipe(hash({template: '<%= name %>-<%= hash %><%= ext %>'})) // Compute hashes for the files' names 
    .pipe(hash.manifest('assets.json')) // Switch to the manifest file 
    .pipe(gulp.dest('server/')) // Write the manifest file 
})
