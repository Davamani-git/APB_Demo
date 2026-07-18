(function() {
  'use strict';

  AppConfig.$inject = ['$routeProvider', '$httpProvider'];

  function AppConfig($routeProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/dashboard/monthly-summary'
      });

    $httpProvider.interceptors.push('HttpInterceptorFactory');
  }

  angular.module('davms.app')
    .config(AppConfig);
})();
