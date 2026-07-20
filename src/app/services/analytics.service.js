(function () {
    'use strict';

    angular
        .module('app')
        .service('AnalyticsService', AnalyticsService);

    AnalyticsService.$inject = ['RestApiService', '$q', 'EnvConfigService'];

    function AnalyticsService(RestApiService, $q, EnvConfigService) {
        this.getSpendingAnalytics = getSpendingAnalytics;

        function getSpendingAnalytics(params) {
            if (EnvConfigService.get('useMockData')) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(window.AnalyticsMockData.getAnalytics(params));
                    }, 500);
                });
            }
            return RestApiService.get('/analytics/spending', { params: params });
        }
    }
})();