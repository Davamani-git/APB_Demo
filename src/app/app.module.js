(function () {
  'use strict';

  angular
    .module('apbDemo', [
      'ngRoute',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap'
    ])
    .config(appConfig)
    .run(appRun);

  appConfig.$inject = ['$httpProvider'];
  function appConfig($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptorService');
  }

  appRun.$inject = ['$rootScope', 'EnvConfigService', 'LoggingService'];
  function appRun($rootScope, EnvConfigService, LoggingService) {
    EnvConfigService.loadConfig().then(function () {
      LoggingService.info('Environment configuration loaded');
    }).catch(function (err) {
      LoggingService.error('Failed to load environment configuration', { error: err });
    });

    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
      LoggingService.error('Route change error', { rejection: rejection });
    });
  }
})();
