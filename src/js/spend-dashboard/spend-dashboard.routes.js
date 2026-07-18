(function() {
  'use strict';

  function SpendDashboardRoutesConfig($routeProvider) {
    $routeProvider
      .when('/dashboard/monthly-summary', {
        templateUrl: 'js/spend-dashboard/views/monthly-dashboard.view.html',
        controller: 'MonthlyDashboardController',
        controllerAs: 'vm'
      });
  }

  SpendDashboardRoutesConfig.$inject = ['$routeProvider'];

  angular.module('davms.spendDashboard')
    .config(SpendDashboardRoutesConfig);
})();