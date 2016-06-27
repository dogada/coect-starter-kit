'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var tap = require('gulp-tap');
var plumber = require('gulp-plumber');
var domain = require('domain')

var browserify = require('browserify');
var resolutions = require('browserify-resolutions');
var watchify = require('watchify');
var jshint = require('gulp-jshint');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var riotify = require('riotify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var _ = require('lodash');

gulp.task('global-libs', function () {
  return gulp.src(['./node_modules/jquery/dist/jquery.min.js',
                   './public/bootstrap/js/bootstrap.min.js'])
    .pipe(concat('global_libs.js'))
    .pipe(gulp.dest('public/dist/'));
});

gulp.task('jquery-js', function () {
  return gulp.src(['./node_modules/jquery/dist/*'])
    .pipe(gulp.dest('public/dist/jquery'))
})


// external libs
var libs = [
  'riot',
  'page',
  'debug',
  'tflow',
  'linkify-it',
  'moment'
]

function browserifyInstance(fileName, userOpts) {
  if(!userOpts) userOpts = {}
  // todo     entries: ['./assets/scripts/main.js'], 
  var defaultOpts = {
    extensions: ['.js']
  };
  var stream = browserify(fileName, _.assign(defaultOpts, userOpts))
  if (/libs\.js$/.test(fileName)) {
    libs.forEach(function(lib) {
      stream.require(lib)
    })
  } else {
    console.log('Excluding from ' + fileName + ' bundle: ', libs)
    libs.forEach(function(lib) {
      stream.external(lib)
    })
  }
  // remove duplicates https://github.com/Updater/browserify-resolutions
  // https://github.com/substack/node-browserify/issues/1063
  stream.plugin(resolutions, '*')
  return stream
}


gulp.task('watch-scripts', function() {
  gulp.watch([
    'client/main.js',
    'lib/*.js',
    // 'client/**/*.{js,tag}',
    // 'test/client/**/*.{js,tag}',
    // 'node_modules/coect-site/**/*.{js,tag}',
    // 'node_modules/coect/client/**/*.{js,tag}',
    // 'node_modules/coect-umedia/client/**/*.{js,tag}',
    //'!**/#*'
  ], ['compile-scripts']);
})


gulp.task('compile-scripts', function() {
  var production = util.env.type === 'production';
  console.log('compile-scripts production', production)
  return gulp.src(['client/libs.js', 'client/main.js', 'client/admin.js', 'test/client/app_tests.js'], {read: false})
    .pipe(tap(function(file) {
      var d = domain.create();

      d.on('error', function(err) {
        util.log(
          util.colors.red('Browserify compile error:'),
          err,
          '\n\t',
          util.colors.cyan('in file'),
          file.path);
      });

      d.run(function() {
        file.contents = browserifyInstance(
          file.path, {debug: !production,
                      fullPaths: !production})
          .bundle()
      })
      
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(gulpif(production, uglify()))
    .pipe(gulpif(production, rename({suffix: '.min'})))
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('public/dist'))

});

gulp.task('lint-client', function() {
  return gulp.src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// ---------------Old ------------------=

gulp.task('watchify-scripts', function() {
  var watchBrowserify = watchify(browserifyInstance(
    './client/main.js',
    _.assign(watchify.args, { debug: true})))
  
  var updateOnChange = function() {
    return watchBrowserify
     .bundle()
     .on('error', util.log.bind(util, 'Browserify Error'))
     .pipe(source('main.js'))
     .pipe(gulp.dest('public/dist'))
  }

  watchBrowserify
    .on('log', util.log)
    .on('update', updateOnChange)

  updateOnChange();
});

gulp.task('external-libs', function () {
  var stream = browserify({
    debug: false,
    require: libs
  })

  stream.bundle()
    .pipe(source('libs-ext.js'))
    .pipe(gulp.dest('public/dist'))

  return stream
});


// doesn't catches browserify errors
gulp.task('make-scripts', function() {
  var production = util.env.type === 'production';
  var stream = browserifyInstance('./client/main.js', {debug: !production})
  //conflicts with gulp and transform in package.js
  //.transform('riotify')
    .bundle()
    .pipe(plumber({errorHandler: console.log}))


  return stream
    .pipe(source('main.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('public/dist'))
});

