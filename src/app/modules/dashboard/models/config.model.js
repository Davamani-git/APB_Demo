(function () {
    'use strict';

    ConfigModel.$inject = [];

    function ConfigModel() {
        var currentConfig = {
            currencyCode: 'INR',
            trendChartType: 'line',
            summaryChartType: 'bar',
            colorPalette: ['#4CAF50', '#2196F3', '#FFC107'],
            highSpendThreshold: 50000,
            featureFlags: {
                showCategoryBreakdown: true,
                showAverageSpend: true
            }
        };

        function createFromResponse(data) {
            currentConfig.currencyCode = data.currencyCode || currentConfig.currencyCode;
            currentConfig.trendChartType = data.trendChartType || currentConfig.trendChartType;
            currentConfig.summaryChartType = data.summaryChartType || currentConfig.summaryChartType;
            currentConfig.colorPalette = data.colorPalette || currentConfig.colorPalette;
            currentConfig.highSpendThreshold = data.highSpendThreshold || currentConfig.highSpendThreshold;
            currentConfig.featureFlags = data.featureFlags || currentConfig.featureFlags;
            return angular.copy(currentConfig);
        }

        function getCurrencyCode() {
            return currentConfig.currencyCode;
        }

        return {
            createFromResponse: createFromResponse,
            getCurrencyCode: getCurrencyCode
        };
    }

    angular.module('app')
        .service('ConfigModel', ConfigModel);

})();
