module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-mocks.js',
      'core/**/*.js',
      'shared/**/*.js',
      'spend-dashboard/**/*.js',
      'security/**/*.js'
    ],
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
