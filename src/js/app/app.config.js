(function() {
  'use strict';

  AppConfig.$inject = ['$routeProvider', '$httpProvider'];

  function AppConfig($routeProvider, $httpProvider) {
    // Default route to monthly summary dashboard
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard/monthly-summary'
      })
      .otherwise({
        redirectTo: '/dashboard/monthly-summary'
      });

    // Register HTTP interceptor from spend dashboard module
    $httpProvider.interceptors.push('HttpInterceptorFactory');
  }

  angular.module('davms.app')
    .config(AppConfig);
})();
