(function () {
  'use strict';

  AppConfig.$inject = ['$routeProvider', '$httpProvider'];

  function AppConfig($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard/monthly-summary', {
        templateUrl: 'src/js/spend-dashboard/views/monthly-dashboard.view.html',
        controller: 'MonthlyDashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard/monthly-summary'
      });

    $httpProvider.interceptors.push('HttpInterceptorFactory');
  }

  angular.module('davms.app').config(AppConfig);
})();
