(function () {
    'use strict';

    angular.module('apbDemo')
        .config(RouteConfig);

    RouteConfig.$inject = ['$routeProvider', 'APP_ROUTES'];

    function RouteConfig($routeProvider, APP_ROUTES) {
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
