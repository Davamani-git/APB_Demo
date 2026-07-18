(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .config(AppRoutes);

  AppRoutes.$inject = ['$routeProvider'];

  function AppRoutes($routeProvider) {
    $routeProvider
      .when('/monthly-summary', {
        templateUrl: 'app/features/monthly-summary/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/monthly-summary'
      });
  }
})();
