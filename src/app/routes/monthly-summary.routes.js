(function () {
  'use strict';

  angular
    .module('apbDemo')
    .config(routeConfig);

  routeConfig.$inject = ['$routeProvider', 'APP_ROUTES'];
  function routeConfig($routeProvider, APP_ROUTES) {
    $routeProvider
      .when(APP_ROUTES.MONTHLY_SUMMARY_ROUTE, {
        templateUrl: 'src/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm',
        resolve: {
          monthContext: ['MonthContextService', function (MonthContextService) {
            return MonthContextService.getMonthContext();
          }]
        }
      })
      .otherwise({
        redirectTo: APP_ROUTES.MONTHLY_SUMMARY_ROUTE
      });
  }
})();
