(function () {
  'use strict';

  angular.module('apbDemo', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
  ])
  .config(AppConfig)
  .run(AppRun);

  AppConfig.$inject = ['$httpProvider'];
  function AppConfig($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptorService');
  }

  AppRun.$inject = ['$rootScope', 'EnvConfigService'];
  function AppRun($rootScope, EnvConfigService) {
    // Preload environment configuration lazily safe (EnvConfigService uses lazy $http)
    EnvConfigService.loadConfig();

    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
      // Global route change error handling can be extended if needed
      // Kept minimal to avoid business logic in run block
    });
  }
})();
