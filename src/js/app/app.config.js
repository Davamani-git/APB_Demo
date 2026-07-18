(function() {
  'use strict';

  AppConfig.$inject = ['$routeProvider', '$httpProvider', '$locationProvider'];

  function AppConfig($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard/monthly-summary'
      })
      .otherwise({
        redirectTo: '/dashboard/monthly-summary'
      });

    $httpProvider.interceptors.push('HttpInterceptorFactory');

    $locationProvider.hashPrefix('');
  }

  angular.module('davms.app').config(AppConfig);
})();