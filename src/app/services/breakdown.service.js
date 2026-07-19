(function () {
    "use strict";

    BreakdownService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "BreakdownModel", "ErrorModel", "$q"];

    function BreakdownService(ApiClient, ENV_CONFIG, LoggingService, BreakdownModel, ErrorModel, $q) {
        this.getBreakdown = function (month) {
            if (!month) {
                var error = new ErrorModel({
                    code: "INVALID_MONTH",
                    message: "The selected month is not valid.",
                    retryable: false
                });
                return $q.reject(error);
            }

            if (ENV_CONFIG.useMockData && window.BreakdownMockData) {
                return getMockBreakdown(month);
            }

            var url = ENV_CONFIG.apiBaseUrl + "/spending/monthly-breakdown?month=" + encodeURIComponent(month);
            LoggingService.info("Requesting breakdown", { month: month });

            return ApiClient.get(url)
                .then(function (response) {
                    var data = response.data || {};
                    var model = new BreakdownModel(data);
                    return model;
                })
                .catch(function (rejection) {
                    var errorData = rejection.data || {};
                    var error = new ErrorModel({
                        code: errorData.code || "SERVICE_UNAVAILABLE",
                        message: errorData.message || "We are unable to display breakdown insights right now.",
                        retryable: true
                    });
                    return $q.reject(error);
                });
        };

        function getMockBreakdown(month) {
            var deferred = $q.defer();
            var dataset = window.BreakdownMockData ? window.BreakdownMockData[month] : null;
            if (!dataset) {
                dataset = window.BreakdownMockData ? window.BreakdownMockData["default"] : null;
            }
            if (!dataset) {
                var error = new ErrorModel({
                    code: "NO_MOCK_DATA",
                    message: "Mock breakdown data is not available.",
                    retryable: false
                });
                deferred.reject(error);
            } else {
                setTimeout(function () {
                    var model = new BreakdownModel(dataset);
                    deferred.resolve(model);
                }, 400);
            }
            return deferred.promise;
        }
    }

    angular.module("app")
        .service("BreakdownService", BreakdownService);
})();
