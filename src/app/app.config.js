(function () {
  'use strict';

  config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

  angular.module('app')
    .config(config);

  function config($routeProvider, $locationProvider, $httpProvider) {
    // Enable hash-based routing for maximum compatibility
    $locationProvider.html5Mode(false);

    // Routes
    $routeProvider
      .when('/spend-summary', {
        templateUrl: 'src/app/features/spend-summary/spend-summary.template.html',
        controller: 'SpendSummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/spend-summary'
      });

    // HTTP Interceptor registration
    $httpProvider.interceptors.push('HttpErrorInterceptor');
  }
})();
