var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watch = require('gulp-watch');
var watchify = require('watchify');
var babelify = require('babelify'); 
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var glob = require('glob');
var webserver = require('gulp-webserver');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var rt = require('gulp-react-templates');
var template = require('gulp-template');

// Swap out TRAVIS_BRANCH with your CI environment variable of choice
var environment = process.env.TRAVIS_BRANCH || 'dev';
var environmentConfig = require('./config/gulpfile.conf.js')[environment];
var buildConfig = require('./config/gulpfile.conf.js').build;
var development = environment === 'dev';

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
  'react/addons',
  'flux-react'
];

gulp.task('compile-index', ['react-templates'], function() {
  var templateOptions = {
    socketIOPath: environmentConfig.socketIOPath,
    app: buildConfig.index.scripts.app,
    vendor: buildConfig.index.scripts.vendors,
    css: buildConfig.index.scripts.css
  };

  var start = Date.now();
  console.log('Copying index.html');
  return gulp.src(buildConfig.index.template)
    .pipe(template(templateOptions))
    .pipe(gulp.dest(environmentConfig.dest))
    .pipe(notify(function() {
      console.log('index.html built in ' + (Date.now() - start) + 'ms');
    }));
});

gulp.task('react-templates', function() {
  var start = Date.now();
  console.log('Precompiling react-templates');
  return gulp.src(buildConfig.reactTemplates)
    .pipe(rt({modules: 'commonjs'}))
    .pipe(gulp.dest(buildConfig.srcDirectory))
    .pipe(notify(function () {
      console.log('react-templates built in ' + (Date.now() - start) + 'ms');
    }));

});

gulp.task('browserify-app', ['browserify-vendors'], function() {
  // Our app bundler
  var appBundler = browserify({
    entries: [buildConfig.src], // Only need initial file, browserify finds the rest
    transform: [babelify], // We want to convert JSX to normal javascript
    debug: development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: development // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing.
  // You might consider doing this for production also and load two javascript
  // files (main.js and vendors.js), as vendors.js will probably not change and
  // takes full advantage of caching
  appBundler.external(development ? dependencies : []);

  // The rebundle process
  var start = Date.now();
  console.log('Building APP bundle');
  return appBundler.bundle()
    .on('error', gutil.log)
    .pipe(source(buildConfig.index.scripts.app))
    .pipe(gulpif(!development, streamify(uglify())))
    .pipe(gulp.dest(environmentConfig.dest))
    .pipe(notify(function () {
      console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
    }));
});

gulp.task('browserify-vendors', function() {
  var vendorsBundler = browserify({
    debug: true,
    require: dependencies
  });

  // Run the vendor bundle
  var start = new Date();
  console.log('Building VENDORS bundle');
  return vendorsBundler.bundle()
    .on('error', gutil.log)
    .pipe(source(buildConfig.index.scripts.vendors))
    .pipe(gulpif(!development, streamify(uglify())))
    .pipe(gulp.dest(environmentConfig.dest))
    .pipe(notify(function () {
      console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
    }));

});

gulp.task('stylesheets', function() {
  var start = new Date();
  console.log('Building CSS bundle');

  if (development) {
    return gulp.src(buildConfig.stylesheets)
      .pipe(concat(buildConfig.index.scripts.css))
      .pipe(gulp.dest(environmentConfig.dest))
      .pipe(notify(function () {
        console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
      }));
  } else {
    return gulp.src(buildConfig.stylesheets)
      .pipe(concat(buildConfig.index.scripts.css))
      .pipe(cssmin())
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('CSS (Minified) bundle built in ' + (Date.now() - start) + 'ms');
      }));
  }
});

gulp.task('webserver',['compile-index', 'browserify-app', 'stylesheets'], function() {
  if (development) {
    return gulp.src(environmentConfig.dest)
      .pipe(webserver({
        livereload: buildConfig.webServer.liveReload,
        directoryListing: false,
        open: true,
        port: buildConfig.webServer.port
      }))
      .pipe(notify(function () {
        console.log('gulp-webserver started on port ' + buildConfig.webServer.port);
      }));
  } else {
    return;
  }
});

// Starts our development workflow
gulp.task('default', ['webserver'], function () {
  gulp.watch(buildConfig.watchFiles,['compile-index', 'browserify-app', 'stylesheets']);
});

gulp.task('test', function () {
    return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});
