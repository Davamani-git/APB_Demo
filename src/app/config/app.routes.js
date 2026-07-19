(function () {
    "use strict";

    appRoutes.$inject = ["$routeProvider", "ROUTE_CONSTANTS"];

    function appRoutes($routeProvider, ROUTE_CONSTANTS) {
        $routeProvider
            .when(ROUTE_CONSTANTS.MONTHLY_SUMMARY.path, {
                templateUrl: "templates/dashboard/monthlySummary.html",
                controller: "MonthlySummaryController",
                controllerAs: "vm",
                resolve: {
                    monthAvailability: ["MonthSelectionService", function (MonthSelectionService) {
                        return MonthSelectionService.getAvailableMonths();
                    }]
                }
            })
            .otherwise({
                redirectTo: ROUTE_CONSTANTS.MONTHLY_SUMMARY.path
            });
    }

    angular.module("app")
        .config(appRoutes);
})();
