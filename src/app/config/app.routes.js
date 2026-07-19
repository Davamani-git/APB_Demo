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
                    }]
                }
            })
            .otherwise({
                redirectTo: "/spending/monthly-summary"
            });
    }

    angular
        .module("app")
        .config(appRoutes);
})();
