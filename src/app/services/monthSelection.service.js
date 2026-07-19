(function () {
    'use strict';

    MonthSelectionService.$inject = ['ApiClient', 'ENV_CONFIG', 'LoggingService', 'MonthAvailabilityModel'];

    function MonthSelectionService(ApiClient, ENV_CONFIG, LoggingService, MonthAvailabilityModel) {
        var service = {
            getAvailableMonths: getAvailableMonths,
            getDefaultMonth: getDefaultMonth
        };

        function getAvailableMonths(customerId) {
            if (ENV_CONFIG.useMockData) {
                return window.MonthSelectionMockService.getAvailableMonths(customerId);
            }

            var url = ENV_CONFIG.apiBaseUrl + '/spending/months';

            return ApiClient.get(url).then(function (response) {
                var data = response.data || [];
                var months = data.map(function (item) {
                    return new MonthAvailabilityModel({
                        month: item.month,
                        isCurrent: !!item.isCurrent,
                        hasData: !!item.hasData
                    });
                });
                return months;
            }).catch(function (error) {
                LoggingService.error('Failed to retrieve available months', {});
                return [];
            });
        }

        function getDefaultMonth(months) {
            if (!months || !months.length) {
                return null;
            }
            var sorted = months.slice().sort(function (a, b) {
                return a.month.localeCompare(b.month);
            });
            return sorted[sorted.length - 1].month;
        }

        return service;
    }

    angular.module('app')
        .service('MonthSelectionService', MonthSelectionService);
})();
