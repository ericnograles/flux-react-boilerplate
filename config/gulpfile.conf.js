module.exports = {
  build: {
    src: './app/main.js',
    srcDirectory: './app',
    jsConcats: ['./node_modules/material-design-lite/material.min.js'], // For libraries that we can't browserify in
    stylesheets: ['./node_modules/material-design-lite/material.min.css'], // For vendor library css
    sass: ['./app/styles/main.scss'],
    reactTemplates: './app/**/*.rt',
    tests: {
      src: ['./app/**/*.spec.js'],
      dest: 'specs.js'
    },
    index: {
      template: './app/index.html',
      scripts: {
        app: 'main.js',
        appCSS: 'main.css',
        vendors: 'vendors.js',
        vendorsCSS: 'vendors.css'
      }
    },
    watchFiles: ['./app/**/*.html','./app/**/*.js', './app/**/*.rt', './styles/**/*.css'],
    dest: {
      build: './build',
      dist: './dist'
    },
    webServer: {
      port: 8200,
      liveReload: true
    }
  },
  dev: {
    socketIOPath: '',
    dest: './build'
  },
  staging: {
    socketIOPath: '',
    dest: './dist'
  },
  qa: {
    socketIOPath: '',
    dest: './dist'
  },
  production: {
    socketIOPath: '',
    dest: './dist'
  }
};