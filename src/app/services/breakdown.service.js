(function () {
    'use strict';

    BreakdownService.$inject = ['ApiClient', 'ENV_CONFIG', 'LoggingService', 'BreakdownModel'];

    function BreakdownService(ApiClient, ENV_CONFIG, LoggingService, BreakdownModel) {
        var service = {
            getBreakdown: getBreakdown
        };

        function getBreakdown(month) {
            if (!month) {
                return Promise.resolve(new BreakdownModel({ month: null, totalSpend: 0, segments: [] }));
            }

            if (ENV_CONFIG.useMockData) {
                return window.BreakdownMockService.getBreakdown(month);
            }

            var url = ENV_CONFIG.apiBaseUrl + '/spending/monthly-breakdown';
            var config = {
                params: {
                    month: month
                }
            };

            return ApiClient.get(url, config).then(function (response) {
                var data = response.data || {};
                return new BreakdownModel({
                    month: data.month,
                    totalSpend: data.totalSpend,
                    segments: data.segments || []
                });
            }).catch(function (error) {
                LoggingService.warn('Failed to retrieve breakdown', { month: month });
                return new BreakdownModel({ month: month, totalSpend: 0, segments: [] });
            });
        }

        return service;
    }

    angular.module('app')
        .service('BreakdownService', BreakdownService);
})();
