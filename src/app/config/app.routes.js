(function () {
    "use strict";

    appRoutes.$inject = ["$routeProvider", "$locationProvider"];

    function appRoutes($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix("");

        $routeProvider
            .when("/spending/monthly-summary", {
                templateUrl: "templates/dashboard/monthlySummary.html",
                controller: "MonthlySummaryController",
                controllerAs: "vm",
                resolve: {
                    monthAvailability: ["MonthSelectionService", function (MonthSelectionService) {
                        return MonthSelectionService.getAvailableMonths();
                    }],
                    initialSummary: ["MonthlySummaryService", "MonthSelectionService", function (MonthlySummaryService, MonthSelectionService) {
                        return MonthSelectionService.getAvailableMonths().then(function (months) {
                            var defaultMonth = MonthSelectionService.getDefaultMonth(months);
                            if (!defaultMonth) {
                                return null;
                            }
                            return MonthlySummaryService.getSummary(defaultMonth);
                        });
                    }]
                }
            })
            .otherwise({
                redirectTo: "/spending/monthly-summary"
            });
    }

    angular.module("app")
        .config(appRoutes);
}());
