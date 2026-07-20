(function () {
    "use strict";

    angular.module("app")
        .config(monthlySummaryRouteConfig);

    monthlySummaryRouteConfig.$inject = ["$routeProvider"];

    function monthlySummaryRouteConfig($routeProvider) {
        $routeProvider.when("/monthly-summary", {
            templateUrl: "src/templates/monthlySummary/monthlySummary.view.html",
            controller: "MonthlySummaryController",
            controllerAs: "vm",
            resolve: {
                envConfig: ["EnvConfigService", function (EnvConfigService) {
                    return EnvConfigService.loadConfig();
                }],
                initialSummary: ["envConfig", "DashboardApiService", "$route", function (envConfig, DashboardApiService, $route) {
                    var params = $route.current && $route.current.params ? $route.current.params : {};
                    var cardId = params.cardId || "CARD123";
                    var month = params.month || getDefaultMonth(envConfig.defaultMonthOffset);
                    return DashboardApiService.getMonthlySummary(cardId, month);
                }]
            }
        });
    }

    function getDefaultMonth(offset) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1 + offset;
        while (month < 1) {
            month += 12;
            year -= 1;
        }
        while (month > 12) {
            month -= 12;
            year += 1;
        }
        var monthString = month < 10 ? "0" + month : "" + month;
        return year + "-" + monthString;
    }
})();
