(function () {
    "use strict";

    angular.module("app")
        .service("MonthlySummaryMockService", MonthlySummaryMockService);

    MonthlySummaryMockService.$inject = ["$q", "$timeout", "ENV_CONFIG", "MonthlySummaryModel", "KpiSummaryModel", "BreakdownItemModel"];

    function MonthlySummaryMockService($q, $timeout, ENV_CONFIG, MonthlySummaryModel, KpiSummaryModel, BreakdownItemModel) {
        this.getMonthlySummary = function (cardId, month) {
            var deferred = $q.defer();

            var latencyMs = Math.min(ENV_CONFIG.apiTimeoutMs - 100, 800);
            if (!latencyMs || latencyMs <= 0) {
                latencyMs = 500;
            }

            $timeout(function () {
                var datasetKey = month;
                var rawDataset = window.MonthlySummaryMockDatasets[datasetKey];

                if (!rawDataset) {
                    var emptySummary = new MonthlySummaryModel({
                        cardId: cardId,
                        month: month,
                        totalSpend: 0,
                        currency: "USD",
                        dataFreshness: "No data"
                    });

                    var resultEmpty = {
                        summary: emptySummary,
                        kpis: [
                            new KpiSummaryModel({ id: "totalSpend", label: "Total Spend", value: 0 }),
                            new KpiSummaryModel({ id: "numTransactions", label: "Number of Transactions", value: 0 }),
                            new KpiSummaryModel({ id: "avgTransactionValue", label: "Average Transaction Value", value: 0 })
                        ],
                        breakdown: []
                    };
                    deferred.resolve(resultEmpty);
                    return;
                }

                var summaryModel = new MonthlySummaryModel(rawDataset);
                var kpiModels = [];
                rawDataset.kpis.forEach(function (kpiDto) {
                    kpiModels.push(new KpiSummaryModel(kpiDto));
                });

                var breakdownModels = [];
                rawDataset.breakdown.forEach(function (breakdownDto) {
                    breakdownModels.push(new BreakdownItemModel(breakdownDto));
                });

                deferred.resolve({
                    summary: summaryModel,
                    kpis: kpiModels,
                    breakdown: breakdownModels
                });
            }, latencyMs);

            return deferred.promise;
        };
    }
})();
