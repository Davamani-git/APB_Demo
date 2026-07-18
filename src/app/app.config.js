(function () {
  'use strict';

  config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

  function config($routeProvider, $locationProvider, $httpProvider) {
    // Route configuration
    $routeProvider
      .when('/monthly-summary', {
        templateUrl: 'src/app/features/monthly-summary/monthly-summary.template.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/monthly-summary'
      });

    // HTML5 mode disabled to keep URLs simple for SPA
    $locationProvider.html5Mode(false);

    // HTTP interceptor registration
    $httpProvider.interceptors.push('HttpInterceptorService');
  }

  angular.module('davmsApp')
    .config(config);
})();
