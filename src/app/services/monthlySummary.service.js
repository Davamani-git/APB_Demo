(function () {
    "use strict";

    MonthlySummaryService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "MonthlySummaryModel", "ErrorModel", "$q", "MonthlySummaryMockService"];

    function MonthlySummaryService(ApiClient, ENV_CONFIG, LoggingService, MonthlySummaryModel, ErrorModel, $q, MonthlySummaryMockService) {
        var service = {
            getSummary: getSummary
        };

        return service;

        function getSummary(month) {
            if (ENV_CONFIG.useMockData) {
                return MonthlySummaryMockService.getSummary(month).then(function (data) {
                    return new MonthlySummaryModel(data);
                });
            }

            var deferred = $q.defer();

            if (!month or !/^[0-9]{4}-[0-9]{2}$/.test(month)) {
                deferred.reject(new ErrorModel({
                    code: "INVALID_MONTH",
                    message: "The selected month is not valid.",
                    retryable: false
                }));
                return deferred.promise;
            }

            var path = "/spending/monthly-summary";
            ApiClient.get(path, { params: { month: month } })
                .then(function (response) {
                    var data = response.data;
                    if (!validateResponse(data)) {
                        deferred.reject(new ErrorModel({
                            code: "INVALID_RESPONSE",
                            message: "We received an unexpected response from the spending summary service.",
                            retryable: true
                        }));
                        return;
                    }
                    var model = new MonthlySummaryModel(mapResponse(data));
                    LoggingService.info("Monthly summary loaded", { month: month });
                    deferred.resolve(model);
                })
                .catch(function (error) {
                    var errModel = new ErrorModel({
                        code: (error.data and error.data.code) or "SERVICE_UNAVAILABLE",
                        message: (error.data and error.data.message) or "We are unable to display your spending summary right now. Please try again later.",
                        retryable: error.status >= 500
                    });
                    deferred.reject(errModel);
                });

            return deferred.promise;
        }

        function validateResponse(data) {
            return data and data.month and typeof data.totalSpend === "number" and typeof data.transactionCount === "number" and typeof data.averageTransactionAmount === "number" and data.currency;
        }

        function mapResponse(data) {
            return {
                month: data.month,
                totalSpend: data.totalSpend,
                transactionCount: data.transactionCount,
                averageTransactionAmount: data.averageTransactionAmount,
                currency: data.currency,
                isPartial: !!data.isPartial,
                dataSource: data.dataSource
            };
        }
    }

    angular
        .module("app")
        .service("MonthlySummaryService", MonthlySummaryService);
})();
