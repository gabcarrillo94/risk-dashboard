'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpNgConfig = require('gulp-ng-config');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */

  var config = require('../configFile.json')[process.argv[3] === '--prod' ? "production" : "local"];
  var domain = config.env.domain;
  var ssl = config.env.ssl;
  var port = config.env.port;
  server.middleware = [
    proxyMiddleware((ssl ? 'https://' : 'http://') + domain + (port ?  ':3000' : '')  + '/wsCasos'),
    proxyMiddleware((ssl ? 'wss://' : 'ws://')  + domain + (port ? ':3000' : '' )+'/socket.io/**'),
    proxyMiddleware((ssl ? 'https://' : 'http://')  + domain  + (port ?  ':3000' : '' )+ '/socket.io/**', { changeOrigin: true, prependPath: false }),
    proxyMiddleware((ssl ? 'https://' : 'http://')  + domain + (port ?  ":" + port : '' )+ '/risk-backend/rest/**', { changeOrigin: true, prependPath: false })
  ]

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
   gulp.src('./configFile.json')
  .pipe(
    gulpNgConfig('dashboard', {
    environment: process.argv[3] === '--prod' ? "production" : "local",
    createModule: false,
    pretty: true
    }))
  .pipe(gulp.dest('./src/app'))
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
