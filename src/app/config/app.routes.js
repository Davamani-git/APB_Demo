(function () {
    'use strict';

    appRoutes.$inject = ['$routeProvider', '$locationProvider', 'ROUTE_CONSTANTS'];

    function appRoutes($routeProvider, $locationProvider, ROUTE_CONSTANTS) {
        $locationProvider.hashPrefix('');

        $routeProvider
            .when(ROUTE_CONSTANTS.spendingMonthlySummary, {
                templateUrl: 'templates/dashboard/monthlySummary.html',
                controller: 'MonthlySummaryController',
                controllerAs: 'vm',
                resolve: {
                    monthAvailability: ['MonthSelectionService', function (MonthSelectionService) {
                        return MonthSelectionService.getAvailableMonths();
                    }],
                    initialSummary: ['MonthlySummaryService', 'MonthSelectionService', function (MonthlySummaryService, MonthSelectionService) {
                        return MonthSelectionService.getAvailableMonths().then(function (months) {
                            var defaultMonth = MonthSelectionService.getDefaultMonth(months);
                            if (defaultMonth) {
                                return MonthlySummaryService.getSummary(defaultMonth);
                            }
                            return null;
                        });
                    }]
                }
            })
            .otherwise({
                redirectTo: ROUTE_CONSTANTS.defaultRoute
            });
    }

    angular.module('app')
        .config(appRoutes);
})();
