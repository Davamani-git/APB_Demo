(function () {
    "use strict";

    MonthlySummaryMockService.$inject = ["$q", "$timeout", "LoggingService"];

    function MonthlySummaryMockService($q, $timeout, LoggingService) {
        var service = {
            getSummary: getSummary
        };

        return service;

        function getSummary(month) {
            var deferred = $q.defer();

            $timeout(function () {
                var datasetKey = month;

                // For demonstration, a specific key returns partial data
                if (month === "2026-07" && Math.random() < 0.3) {
                    datasetKey = "partial-2026-07";
                }

                var summary = window.MonthlySummaryMockData[datasetKey];

                if (!summary) {
                    LoggingService.warn("No mock summary for month", { month: month });
                    deferred.resolve({
                        month: month,
                        totalSpend: 0,
                        transactionCount: 0,
                        averageTransactionAmount: 0,
                        currency: "INR",
                        isPartial: false,
                        dataSource: "MOCK_DEFAULT"
                    });
                    return;
                }

                LoggingService.info("Mock summary loaded", { month: month, datasetKey: datasetKey });
                deferred.resolve(summary);
            }, 600);

            return deferred.promise;
        }
    }

    angular
        .module("app")
        .service("MonthlySummaryMockService", MonthlySummaryMockService);
})();
