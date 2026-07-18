(function() {
  'use strict';

  function AppConfig($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard/monthly-summary'
      })
      .otherwise({
        redirectTo: '/dashboard/monthly-summary'
      });

    $httpProvider.interceptors.push('HttpInterceptorFactory');
  }

  AppConfig.$inject = ['$routeProvider', '$httpProvider'];

  angular.module('davms.app')
    .config(AppConfig);
})();