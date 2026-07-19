(function () {
    'use strict';

    MonthlySummaryModel.$inject = [];

    function MonthlySummaryModel() {
        function create(month, totalSpend, transactionCount, averageSpend, currency, kpiMetrics, chartData, chartOptions, isEmpty) {
            return {
                month: month,
                totalSpend: totalSpend,
                transactionCount: transactionCount,
                averageSpend: averageSpend,
                currency: currency,
                kpiMetrics: kpiMetrics || {},
                chartData: chartData || null,
                chartOptions: chartOptions || null,
                isEmpty: isEmpty,
                totalSpendFormatted: null,
                averageSpendFormatted: null,
                trend: null
            };
        }

        function createFromResponse(data) {
            var month = data.month;
            var totalSpend = data.totalSpend;
            var transactionCount = data.transactionCount;
            var currency = data.currency || 'INR';
            var averageSpend = data.averageSpend;
            if (averageSpend === undefined || averageSpend === null) {
                if (transactionCount > 0) {
                    averageSpend = totalSpend / transactionCount;
                } else {
                    averageSpend = 0;
                }
            }
            var isEmpty = transactionCount === 0;
            var model = create(month, totalSpend, transactionCount, averageSpend, currency, data.kpiMetrics, data.chartData, data.chartOptions, isEmpty);
            model.totalSpendFormatted = totalSpend;
            model.averageSpendFormatted = averageSpend;
            model.trend = data.kpiMetrics && data.kpiMetrics.trend ? data.kpiMetrics.trend : null;
            return model;
        }

        return {
            create: create,
            createFromResponse: createFromResponse
        };
    }

    angular.module('app')
        .service('MonthlySummaryModel', MonthlySummaryModel);

})();
