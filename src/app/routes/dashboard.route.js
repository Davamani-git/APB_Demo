(function () {
  'use strict';

  dashboardRouteConfig.$inject = ['$routeProvider'];

  function dashboardRouteConfig($routeProvider) {
    $routeProvider
      .when('/dashboard/spending-summary', {
        templateUrl: 'templates/dashboard/spending-summary-dashboard.html',
        controller: 'SpendingSummaryDashboardController',
        controllerAs: 'vm'
      });
  }

  angular.module('app')
    .config(dashboardRouteConfig);
})();
