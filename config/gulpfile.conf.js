module.exports = {
  build: {
    src: './app/main.js',
    srcDirectory: './app',
    stylesheets: ['./styles/**/*.css'],
    reactTemplates: './app/**/*.rt',
    tests: ['./app/**/*.spec.js'],
    index: {
      template: './app/index.html',
      scripts: {
        app: 'main.js',
        vendors: 'vendors.js',
        css: 'main.css'
      },
    },
    watchFiles: ['./app/**/*.js', './app/**/*.rt', './styles/**/*.css'],
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