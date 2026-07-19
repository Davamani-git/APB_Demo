(function () {
    "use strict";

    KpiService.$inject = ["ENV_CONFIG", "KpiModel", "$q"];

    function KpiService(ENV_CONFIG, KpiModel, $q) {
        function buildKpisFromSummary(summary) {
            var kpis = [];
            if (!summary) {
                return kpis;
            }

            var totalSpendKpi = new KpiModel({
                id: "totalSpend",
                label: "Total Spend",
                value: summary.totalSpend,
                formattedValue: "",
                iconUrl: "fa-credit-card",
                trendIndicator: "neutral",
                supportingLabel: "Across all linked credit cards"
            });

            var transactionCountKpi = new KpiModel({
                id: "transactionCount",
                label: "Number of Transactions",
                value: summary.transactionCount,
                formattedValue: "",
                iconUrl: "fa-list-ul",
                trendIndicator: "neutral",
                supportingLabel: "Posted transactions"
            });

            var avgAmountKpi = new KpiModel({
                id: "averageTransactionAmount",
                label: "Average Transaction Amount",
                value: summary.averageTransactionAmount,
                formattedValue: "",
                iconUrl: "fa-bar-chart",
                trendIndicator: "neutral",
                supportingLabel: "Per posted transaction"
            });

            kpis.push(totalSpendKpi);
            kpis.push(transactionCountKpi);
            kpis.push(avgAmountKpi);

            return kpis;
        }

        function buildKpis(summary) {
            var kpis = buildKpisFromSummary(summary);
            return $q.resolve(kpis);
        }

        return {
            buildKpis: buildKpis
        };
    }

    angular.module("app")
        .service("KpiService", KpiService);
}());
