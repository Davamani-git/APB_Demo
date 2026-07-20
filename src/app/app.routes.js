(function () {
  'use strict';

  angular.module('apbDemo')
    .config(AppRoutesConfig);

  AppRoutesConfig.$inject = ['$routeProvider', 'APP_ROUTES'];
  function AppRoutesConfig($routeProvider, APP_ROUTES) {
    $routeProvider
      .when(APP_ROUTES.MONTHLY_SUMMARY_ROUTE, {
        templateUrl: 'src/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm',
        resolve: {
          envConfig: ['EnvConfigService', function (EnvConfigService) {
            return EnvConfigService.loadConfig();
          }],
          monthContext: ['envConfig', 'MonthContextService', function (envConfig, MonthContextService) {
            return MonthContextService.getMonthContext();
          }]
        }
      })
      .otherwise({
        redirectTo: APP_ROUTES.MONTHLY_SUMMARY_ROUTE
      });
  }
})();
