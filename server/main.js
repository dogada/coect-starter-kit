'use strict';

if (process.env.NODE_ENV === 'production') {
  // advanced PM2 monitoring http://docs.keymetrics.io/docs/pages/http/
  require('pmx').init({
    http : true
  })
}

var debug = require('debug')('site:server');
var http = require('http')

var config = require('./config')
var app = require('./app')
var toobusy = require('toobusy-js')

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = 'Port ' + config.port
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

function onListening() {
  console.log('Listening on ' + config.port)
}

var server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)
server.listen(config.port)

process.on('SIGINT', function() {
  server.close()
  // calling .shutdown allows your process to exit normally 
  toobusy.shutdown()
  process.exit()
})
