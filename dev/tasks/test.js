'use strict';

var path = require('path')
var gulp = require('gulp')
var util = require('gulp-util')
var rename = require('gulp-rename')

var browserify = require('browserify')
var watchify = require('watchify')
var jshint = require('gulp-jshint')

var riotify = require('riotify')
var source = require('vinyl-source-stream')

var mochaPhantomjs = require('gulp-mocha-phantomjs')
var Server = require('karma').Server

gulp.task('lint-test', function() {
  return gulp.src('test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})


gulp.task('mocha-client-test', function(done) {
  return gulp.src('./dev/mocha_public/index.html')
    .pipe(mochaPhantomjs())
  done()
})

gulp.task('karma-test', function (done) {
  new Server({
    configFile: path.join(__dirname, '../../karma.conf.js'),
    singleRun: true
  }, done).start()
})

gulp.task('karma-watch', ['watch-test'], function (done) {
  new Server({
    configFile: path.join(__dirname, '../../karma.conf.js'),
    singleRun: false
  }, done).start()
})

gulp.task('test-client', ['build-test', 'mocha-client-test', 'karma-test'])

