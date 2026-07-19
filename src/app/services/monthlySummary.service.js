(function () {
    "use strict";

    MonthlySummaryService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "MonthlySummaryModel", "ErrorModel", "$q"];

    function MonthlySummaryService(ApiClient, ENV_CONFIG, LoggingService, MonthlySummaryModel, ErrorModel, $q) {
        this.getSummary = function (month) {
            if (!month || !isValidMonthFormat(month)) {
                var error = new ErrorModel({
                    code: "INVALID_MONTH",
                    message: "The selected month is not valid.",
                    retryable: false
                });
                return $q.reject(error);
            }

            if (ENV_CONFIG.useMockData) {
                return getMockSummary(month);
            }

            var url = ENV_CONFIG.apiBaseUrl + "/spending/monthly-summary?month=" + encodeURIComponent(month);
            LoggingService.info("Requesting monthly summary", { month: month });

            return ApiClient.get(url)
                .then(function (response) {
                    var data = response.data || {};
                    if (!validateResponse(data)) {
                        var invalidError = new ErrorModel({
                            code: "INVALID_RESPONSE",
                            message: "We were unable to interpret the summary data.",
                            retryable: true
                        });
                        return $q.reject(invalidError);
                    }
                    var model = new MonthlySummaryModel(mapResponse(data));
                    return model;
                })
                .catch(function (rejection) {
                    var errorData = rejection.data || {};
                    var error = new ErrorModel({
                        code: errorData.code || "SERVICE_UNAVAILABLE",
                        message: errorData.message || "We are unable to display your spending summary right now. Please try again later.",
                        retryable: true
                    });
                    return $q.reject(error);
                });
        };

        function isValidMonthFormat(month) {
            var pattern = /^\d{4}-\d{2}$/;
            return pattern.test(month);
        }

        function validateResponse(data) {
            return data && typeof data.month === "string" && typeof data.totalSpend === "number" && typeof data.transactionCount === "number" && typeof data.averageTransactionAmount === "number" && typeof data.currency === "string";
        }

        function mapResponse(data) {
            return {
                month: data.month,
                totalSpend: data.totalSpend,
                transactionCount: data.transactionCount,
                averageTransactionAmount: data.averageTransactionAmount,
                currency: data.currency,
                isPartial: !!data.isPartial,
                dataSource: data.dataSource || ""
            };
        }

        function getMockSummary(month) {
            var deferred = $q.defer();
            var dataset = window.MonthlySummaryMockData ? window.MonthlySummaryMockData[month] : null;
            if (!dataset) {
                dataset = window.MonthlySummaryMockData ? window.MonthlySummaryMockData["default"] : null;
            }
            if (!dataset) {
                var error = new ErrorModel({
                    code: "NO_MOCK_DATA",
                    message: "Mock summary data is not available.",
                    retryable: false
                });
                deferred.reject(error);
            } else {
                setTimeout(function () {
                    var model = new MonthlySummaryModel(mapResponse(dataset));
                    deferred.resolve(model);
                }, 400);
            }
            return deferred.promise;
        }
    }

    angular.module("app")
        .service("MonthlySummaryService", MonthlySummaryService);
})();
