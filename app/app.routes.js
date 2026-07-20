(function () {
  'use strict';

  angular.module('apbDemo')
    .config(AppRoutesConfig);

  AppRoutesConfig.$inject = ['$routeProvider', 'APP_ROUTES'];
  function AppRoutesConfig($routeProvider, APP_ROUTES) {
    $routeProvider
      .when(APP_ROUTES.MONTHLY_SUMMARY_ROUTE, {
        templateUrl: 'templates/monthly-summary.view.html',
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
