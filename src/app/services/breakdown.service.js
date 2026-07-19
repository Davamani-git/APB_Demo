(function () {
    "use strict";

    BreakdownService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "BreakdownModel", "$q"];

    function BreakdownService(ApiClient, ENV_CONFIG, LoggingService, BreakdownModel, $q) {
        function buildBreakdownUrl(month) {
            var baseUrl = ENV_CONFIG.apiBaseUrl + "/spending/monthly-breakdown";
            return baseUrl + "?month=" + encodeURIComponent(month);
        }

        function getBreakdownFromApi(month) {
            var url = buildBreakdownUrl(month);
            return ApiClient.get(url).then(function (response) {
                var data = response.data || {};
                var model = new BreakdownModel(data);
                if (model.sumOfSegments() > model.totalSpend) {
                    LoggingService.warn("Breakdown segments exceed total", { month: month });
                }
                return model;
            });
        }

        function getBreakdownFromMock(month) {
            return window.BreakdownMockService.getBreakdown(month);
        }

        function getBreakdown(month) {
            if (ENV_CONFIG.useMockData) {
                return getBreakdownFromMock(month);
            }
            return getBreakdownFromApi(month);
        }

        return {
            getBreakdown: getBreakdown
        };
    }

    angular.module("app")
        .service("BreakdownService", BreakdownService);
}());
