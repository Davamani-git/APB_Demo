(function () {
  'use strict';

  angular
    .module('apb.core')
    .config(routeConfig);

  routeConfig.$inject = ['$routeProvider'];

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/dashboard/monthly-spend', {
        templateUrl: 'spend-dashboard/views/monthly-dashboard.view.html',
        controller: 'MonthlyDashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard/monthly-spend'
      });
  }
})();
