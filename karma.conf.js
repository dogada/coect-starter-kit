// Karma configuration
// Generated on Fri Dec 11 2015 11:31:05 GMT+0200 (EET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // https://github.com/karma-runner/karma/issues/179
    urlRoot: '/__karma/',

    proxies: {
      '/': 'http://localhost:3000/'
    },

    

    // list of files / patterns to load in the browser
    // https://karma-runner.github.io/0.8/config/files.html
    files: [
      'test/client/workarounds.js',
      'public/dist/global_libs.js',
      'public/dist/libs.js',
      'public/dist/app_tests.js'
    ],


    // list of files to exclude
    exclude: [
      '*_flymake.js'
    ],

    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'expect', 'riot'],
    preprocessors: {
      '**/*.tag': ['riot']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    // 'Chrome', 'Firefox', 'PhantomJS',
    browsers: ['Firefox', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,
  })
}
