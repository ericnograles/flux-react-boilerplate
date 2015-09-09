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
var gulpConfig = require('./config/gulpfile.conf.js')[environment];

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
  'react/addons',
  'flux-react'
];

var indexTask = function(options) {
  var templateOptions = {
    socketIOPath: gulpConfig.socketIOPath,
    app: options.app,
    vendor: options.vendor,
    css: options.css
  };

  var copyIndex = function() {
    var start = Date.now();
    console.log('Copying index.html');
    gulp.src(options.src)
      .pipe(template(templateOptions))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function() {
        console.log('index.html built in ' + (Date.now() - start) + 'ms');
      }));
  };

  copyIndex();

  if (options.development) {
    watch(options.src, copyIndex());
  }
};

var reactTemplateTask = function(options) {
  var start = Date.now();
  console.log('Precompiling react-templates');
  var precompileTemplates = function() {
    gulp.src(options.src)
      .pipe(rt({modules: 'commonjs'}))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('react-templates built in ' + (Date.now() - start) + 'ms');
      }));
  };

  precompileTemplates();

  if (options.development) {
    watch(options.src, precompileTemplates);
  }
};

var browserifyTask = function (options) {

  // Our app bundler
	var appBundler = browserify({
		entries: [options.src], // Only need initial file, browserify finds the rest
   	transform: [babelify], // We want to convert JSX to normal javascript
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});

	// We set our dependencies as externals on our app bundler when developing.
  // You might consider doing this for production also and load two javascript
  // files (main.js and vendors.js), as vendors.js will probably not change and
  // takes full advantage of caching
	appBundler.external(options.development ? dependencies : []);


  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('main.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included 
  // in the application bundle
  if (options.development) {

  	var testFiles = glob.sync('./app/**/*.spec.js');
		var testBundler = browserify({
			entries: testFiles,
			debug: true, // Gives us sourcemapping
			transform: [babelify],
			cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
		});

    testBundler.external(dependencies);

  	var rebundleTests = function () {
  		var start = Date.now();
  		console.log('Building TEST bundle');
  		testBundler.bundle()
      .on('error', gutil.log)
	      .pipe(source('specs.js'))
	      .pipe(gulp.dest(options.dest))
	      .pipe(notify(function () {
	        console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
	      }));
  	};

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();

    // Remove react-addons when deploying, as it is only for
    // testing
    if (!options.development) {
      dependencies.splice(dependencies.indexOf('react/addons'), 1);
    }

    var vendorsBundler = browserify({
      debug: true,
      require: dependencies
    });
    
    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));
    
  }

};

var cssTask = function (options) {
    if (options.development) {
      var run = function () {
        console.log(arguments);
        var start = new Date();
        console.log('Building CSS bundle');
        gulp.src(options.src)
          .pipe(concat('main.css'))
          .pipe(gulp.dest(options.dest))
          .pipe(notify(function () {
            console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
          }));
      };
      run();
      gulp.watch(options.src, run);
    } else {
      gulp.src(options.src)
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(options.dest));   
    }
};

var webserverTask = function(options) {
  if (options.development) {
    gulp.src(options.src)
    .pipe(webserver({
        livereload: options.livereload,
        directoryListing: false,
        open: true,
        port: options.port
      }));
    console.log('gulp-webserver started on port ' + options.port)
  }
};

// Starts our development workflow
gulp.task('default', function () {

  // Copies index.html fresh over to ./build with environment specific transforms
  indexTask({
    development: environment === 'dev',
    src: './app/index.html',
    app: 'main.js',
    vendor: 'vendors.js',
    css: 'main.css',
    dest: './build'
  });

  // Turns *.rt to .js files for use in the application (see gulp-react-templates)
  reactTemplateTask({
    development: environment === 'dev',
    src: './app/**/*.rt',
    dest: './app'
  });

  browserifyTask({
    development: environment === 'dev',
    src: './app/main.js',
    dest: './build'
  });
  
  cssTask({
    development: environment === 'dev',
    src: './styles/**/*.css',
    dest: './build'
  });

  webserverTask({
    livereload: true,
    port: 8200,
    development: environment === 'dev',
    src: './build'
  });

});

gulp.task('deploy', function () {

  indexTask({
    development: environment === 'dev',
    src: './app/index.html',
    app: 'main.js',
    vendor: 'vendors.js',
    css: 'main.css',
    dest: './dist'
  });

  reactTemplateTask({
    development: environment === 'dev',
    src: './app/**/*.rt',
    dest: './app'
  });

  browserifyTask({
    development: environment === 'dev',
    src: './app/main.js',
    dest: './dist'
  });
  
  cssTask({
    development: environment === 'dev',
    src: './styles/**/*.css',
    dest: './dist'
  });

});

gulp.task('test', function () {
    return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});
