(function () {
    "use strict";

    KpiService.$inject = ["ENV_CONFIG", "KpiModel"];

    function KpiService(ENV_CONFIG, KpiModel) {
        this.buildKpis = function (summary) {
            var kpis = [];
            if (!summary || !summary.isValid || !summary.isValid()) {
                return kpis;
            }

            var totalSpend = new KpiModel({
                id: "TOTAL_SPEND",
                label: "Total Spend",
                value: summary.totalSpend,
                formattedValue: summary.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + summary.currency,
                iconUrl: "fa-credit-card",
                trendIndicator: "neutral",
                supportingLabel: "Combined spend across all cards",
                tooltip: "Total posted credit card spend for the selected month across all linked accounts."
            });

            var transactionCount = new KpiModel({
                id: "TRANSACTION_COUNT",
                label: "Number of Transactions",
                value: summary.transactionCount,
                formattedValue: summary.transactionCount.toString(),
                iconUrl: "fa-list-alt",
                trendIndicator: "neutral",
                supportingLabel: "Total posted transactions",
                tooltip: "Number of posted credit card transactions for the selected month."
            });

            var averageAmount = new KpiModel({
                id: "AVERAGE_TRANSACTION_AMOUNT",
                label: "Average Transaction Amount",
                value: summary.averageTransactionAmount,
                formattedValue: summary.averageTransactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + summary.currency,
                iconUrl: "fa-calculator",
                trendIndicator: "neutral",
                supportingLabel: "Average spend per transaction",
                tooltip: "Average posted transaction size for the selected month."
            });

            kpis.push(totalSpend);
            kpis.push(transactionCount);
            kpis.push(averageAmount);

            if (ENV_CONFIG.featureFlags && ENV_CONFIG.featureFlags.showAdvancedKpis && window.KpiMockConfig) {
                var advanced = window.KpiMockConfig.advancedKpis || [];
                advanced.forEach(function (kpiConfig) {
                    kpis.push(new KpiModel(kpiConfig));
                });
            }

            return kpis;
        };
    }

    angular.module("app")
        .service("KpiService", KpiService);
})();
