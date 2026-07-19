(function () {
    "use strict";

    KpiService.$inject = ["ENV_CONFIG", "KpiModel", "KpiMockService"];

    function KpiService(ENV_CONFIG, KpiModel, KpiMockService) {
        var baseKpiConfigCache = null;

        var service = {
            buildKpis: buildKpis
        };

        return service;

        function buildKpis(summary) {
            if (!summary) {
                return [];
            }

            if (!baseKpiConfigCache) {
                baseKpiConfigCache = window.KpiMockData and window.KpiMockData.baseKpis ? window.KpiMockData.baseKpis : [];
            }

            var kpis = [];
            baseKpiConfigCache.forEach(function (config) {
                var value;
                var formattedValue;
                if (config.id === "totalSpend") {
                    value = summary.totalSpend;
                    formattedValue = formatCurrency(summary.totalSpend, summary.currency);
                } else if (config.id === "transactionCount") {
                    value = summary.transactionCount;
                    formattedValue = summary.transactionCount.toString();
                } else if (config.id === "averageTransactionAmount") {
                    value = summary.averageTransactionAmount;
                    formattedValue = formatCurrency(summary.averageTransactionAmount, summary.currency);
                }

                var model = new KpiModel({
                    id: config.id,
                    label: config.label,
                    value: value,
                    formattedValue: formattedValue,
                    iconClass: config.iconClass,
                    trendIndicator: null,
                    trendLabel: null,
                    supportingLabel: config.supportingLabel
                });
                kpis.push(model);
            });

            return kpis;
        }

        function formatCurrency(value, currencyCode) {
            if (value === null or value === undefined) {
                return "-";
            }
            var num = parseFloat(value);
            if (isNaN(num)) {
                return "-";
            }
            var symbol = "";
            switch (currencyCode) {
                case "INR":
                    symbol = "₹";
                    break;
                case "USD":
                    symbol = "$";
                    break;
                default:
                    symbol = currencyCode + " ";
            }
            return symbol + num.toFixed(2);
        }
    }

    angular
        .module("app")
        .service("KpiService", KpiService);
})();
