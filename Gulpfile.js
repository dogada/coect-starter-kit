'use strict';

var gulp = require('gulp')
var gulpsync = require('gulp-sync')(gulp)

var del = require('del')

require('./dev/tasks/scripts')
require('./dev/tasks/styles')
require('./dev/tasks/assets')
require('./dev/tasks/test')
require('./dev/tasks/browsersync')
require('./dev/tasks/run')


gulp.task('clean', function(done) {
  return del(['build', 'public/dist', 'server/assets.json'], done)
});

gulp.task('watch', ['compile', 'nodemon', 'browser-sync', 'watch-scripts', 'watch-styles'])

gulp.task('run', ['watch'])

// use `npm run lint` instead becaue it uses fresh jshint with es6 support
//gulp.task('lint', ['lint-client', 'lint-test'])

gulp.task('prepare-libs', ['global-libs', 'jquery-js', 'vendor-css', 'vendor-fonts', 'font-awesome'])

gulp.task('compile-app', ['compile-scripts', 'compile-styles'])

gulp.task('compile', ['prepare-libs', 'compile-app'])

gulp.task('build', gulpsync.sync(['clean', 'compile', 'assets-manifest']))

gulp.task('default', ['build'])
