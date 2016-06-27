'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

//var buffer = require('vinyl-buffer');
//var path = require('path');
//var LessPluginCleanCSS = require('less-plugin-clean-css')
// var LessPluginAutoPrefix = require('less-plugin-autoprefix')
// var cleancss = new LessPluginCleanCSS({advanced: true})
// var autoprefix = new LessPluginAutoPrefix({browsers: ['last 2 versions']})

gulp.task('vendor-css', function () {
  return gulp.src(['./node_modules/bootstrap/dist/css/*'])
    .pipe(gulp.dest('public/dist/css/'))
})

gulp.task('vendor-fonts', function () {
  return gulp.src(['./node_modules/bootstrap/dist/fonts/*'])
    .pipe(gulp.dest('public/dist/fonts/'))
})

gulp.task('font-awesome', function () {
  return gulp.src(['./node_modules/font-awesome/{css,fonts}/*'])
    .pipe(gulp.dest('public/dist/font-awesome/'))
})


gulp.task('compile-styles', function() {
  return gulp.src('./client/main.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())// sourcemaps conflict {plugins: [autoprefix, cleancss]}
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/dist'));
})

gulp.task('watch-styles', function() {
  return gulp.watch([
    'client/**/*.{less,css}',
    'node_modules/coect-umedia/client/styles/*.{less,css}'
  ], ['compile-styles']);
})
