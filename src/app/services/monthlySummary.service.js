(function () {
    "use strict";

    MonthlySummaryService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "MonthlySummaryModel", "$q"];

    function MonthlySummaryService(ApiClient, ENV_CONFIG, LoggingService, MonthlySummaryModel, $q) {
        function buildRequestUrl(month) {
            var baseUrl = ENV_CONFIG.apiBaseUrl + "/spending/monthly-summary";
            return baseUrl + "?month=" + encodeURIComponent(month);
        }

        function validateMonth(month) {
            if (!month || typeof month !== "string" || month.length !== 7 || month.indexOf("-") !== 4) {
                return false;
            }
            return true;
        }

        function getSummaryFromApi(month) {
            var url = buildRequestUrl(month);
            return ApiClient.get(url).then(function (response) {
                var json = response.data || {};
                var model = new MonthlySummaryModel(json);
                if (!model.isValid()) {
                    LoggingService.error("Invalid monthly summary response", { month: month });
                    return $q.reject({
                        data: {
                            code: "INVALID_RESPONSE",
                            message: "Unable to display your spending summary right now.",
                            retryable: true
                        }
                    });
                }
                return model;
            });
        }

        function getSummaryFromMock(month) {
            return window.MonthlySummaryMockService.getSummary(month);
        }

        function getSummary(month) {
            if (!validateMonth(month)) {
                return $q.reject({
                    data: {
                        code: "INVALID_MONTH",
                        message: "Please select a valid month.",
                        retryable: false
                    }
                });
            }

            if (ENV_CONFIG.useMockData) {
                return getSummaryFromMock(month);
            }

            return getSummaryFromApi(month);
        }

        return {
            getSummary: getSummary
        };
    }

    angular.module("app")
        .service("MonthlySummaryService", MonthlySummaryService);
}());
