module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular-mocks.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular-route.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular-animate.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular-sanitize.min.js',
      'app.js',
      'core/**/*.js',
      'config/**/*.js',
      'layout/**/*.js',
      'shared/**/*.js',
      'security/**/*.js',
      'spend-dashboard/**/*.js',
      'spend-dashboard/tests/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  });
};
