(function() {
  'use strict';

  SpendDashboardRoutesConfig.$inject = ['$routeProvider'];

  function SpendDashboardRoutesConfig($routeProvider) {
    $routeProvider
      .when('/dashboard/monthly-summary', {
        templateUrl: 'js/spend-dashboard/views/monthly-dashboard.view.html',
        controller: 'MonthlyDashboardController',
        controllerAs: 'vm'
      });
  }

  angular.module('davms.spendDashboard').config(SpendDashboardRoutesConfig);
})();