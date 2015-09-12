var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watch = require('gulp-watch');
var babelify = require('babelify'); 
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var glob = require('glob');
var webserver = require('gulp-webserver');
var rt = require('gulp-react-templates');
var template = require('gulp-template');
var Server = require('karma').Server;
var args = require('yargs').argv;


// Swap out TRAVIS_BRANCH with your CI environment variable of choice
// Optionally, pass in --environment [dev/staging/qa/prod] to override
var environment = process.env.TRAVIS_BRANCH || args.environment || 'dev';
var environmentConfig = require('./config/gulpfile.conf.js')[environment];
var buildConfig = require('./config/gulpfile.conf.js').build;
var isDevelopment = environment === 'dev';

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
  'react/addons',
  'flux-react',
  'react-router',
  'history',
  'request'
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

gulp.task('browserify-app', ['browserify-vendors', 'browserify-unit-tests'], function() {
  // Our app bundler
  var appBundler = browserify({
    entries: [buildConfig.src], // Only need initial file, browserify finds the rest
    transform: [babelify], // We want to convert JSX to normal javascript
    debug: isDevelopment, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: isDevelopment // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing.
  // You might consider doing this for production also and load two javascript
  // files (main.js and vendors.js), as vendors.js will probably not change and
  // takes full advantage of caching
  appBundler.external(isDevelopment ? dependencies : []);

  // The rebundle process
  var start = Date.now();
  console.log('Building APP bundle');
  return appBundler.bundle()
    .on('error', gutil.log)
    .pipe(source(buildConfig.index.scripts.app))
    .pipe(gulpif(!isDevelopment, streamify(uglify())))
    .pipe(gulp.dest(environmentConfig.dest))
    .pipe(notify(function () {
      console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
    }));
});

gulp.task('browserify-vendors', function() {
  // Remove react-addons if we are not in dev mode
  if (!isDevelopment) {
    console.log('Not development');
    dependencies.splice(dependencies.indexOf('react/addons'), 1);
  }
  var vendorsBundler = browserify({
    debug: true,
    require: dependencies,
    entries: buildConfig.jsConcats
  });

  // Run the vendor bundle
  var start = new Date();
  console.log('Building VENDORS bundle');
  return vendorsBundler.bundle()
    .on('error', gutil.log)
    .pipe(source(buildConfig.index.scripts.vendors))
    .pipe(gulpif(!isDevelopment, streamify(uglify())))
    .pipe(gulp.dest(environmentConfig.dest))
    .pipe(notify(function () {
      console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
    }));

});

gulp.task('browserify-unit-tests', function() {
  var testFiles = glob.sync(buildConfig.tests.src.toString());
  var testBundler = browserify({
    entries: testFiles,
    debug: true, // Gives us sourcemapping
    transform: [babelify],
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  testBundler.external(dependencies);

  var start = new Date();
  console.log('Building TEST bundle');
  return testBundler.bundle()
    .on('error', gutil.log)
    .pipe(source(buildConfig.tests.dest))
    .pipe(gulp.dest(environmentConfig.dest))
    .pipe(notify(function () {
      console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
    }));
});

gulp.task('stylesheets', function() {
  var start = new Date();
  console.log('Building CSS bundle');

  if (isDevelopment) {
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
      .pipe(gulp.dest(environmentConfig.dest))
      .pipe(notify(function () {
        console.log('CSS (Minified) bundle built in ' + (Date.now() - start) + 'ms');
      }));
  }
});

gulp.task('webserver',['compile-index', 'unit-tests', 'stylesheets'], function() {
  if (isDevelopment) {
    return gulp.src(environmentConfig.dest)
      .pipe(webserver({
        livereload: buildConfig.webServer.liveReload,
        fallback: 'index.html',
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

gulp.task('deploy', ['compile-index', 'unit-tests', 'stylesheets'], function() {
  console.log('Successfully deployed to ' + environmentConfig.dest);
});

gulp.task('unit-tests', ['browserify-app'], function(done) {
  new Server({
    configFile: __dirname + '/config/karma.conf.js',
    singleRun: true //!development
  }, done).start();
});

// Starts our development workflow
gulp.task('default', ['webserver'], function () {
  gulp.watch(buildConfig.watchFiles,['compile-index', 'unit-tests', 'stylesheets']);
});
