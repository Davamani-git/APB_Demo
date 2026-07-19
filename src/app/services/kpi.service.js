(function () {
    'use strict';

    KpiService.$inject = ['ENV_CONFIG', 'KpiModel'];

    function KpiService(ENV_CONFIG, KpiModel) {
        var service = {
            buildKpis: buildKpis
        };

        function buildKpis(summary) {
            if (!summary) {
                return [];
            }

            var kpis = [];

            kpis.push(new KpiModel({
                id: 'totalSpend',
                label: 'Total Spend',
                value: summary.totalSpend,
                formattedValue: summary.currency + ' ' + summary.totalSpend.toFixed(2),
                iconUrl: 'fa-credit-card',
                trendIndicator: 'neutral'
            }));

            kpis.push(new KpiModel({
                id: 'transactionCount',
                label: 'Number of Transactions',
                value: summary.transactionCount,
                formattedValue: summary.transactionCount,
                iconUrl: 'fa-list-alt',
                trendIndicator: 'neutral'
            }));

            kpis.push(new KpiModel({
                id: 'averageTransactionAmount',
                label: 'Average Transaction Amount',
                value: summary.averageTransactionAmount,
                formattedValue: summary.currency + ' ' + summary.averageTransactionAmount.toFixed(2),
                iconUrl: 'fa-bar-chart',
                trendIndicator: 'neutral'
            }));

            if (ENV_CONFIG.featureFlags && ENV_CONFIG.featureFlags.showAdvancedKpis) {
                // Placeholder for additional KPIs defined by business configuration.
            }

            return kpis;
        }

        return service;
    }

    angular.module('app')
        .service('KpiService', KpiService);
})();
