(function () {
    'use strict';

    angular
        .module('app')
        .service('DashboardService', DashboardService);

    DashboardService.$inject = ['RestApiService', '$q', 'EnvConfigService'];

    function DashboardService(RestApiService, $q, EnvConfigService) {
        this.getDashboardSummary = getDashboardSummary;

        function getDashboardSummary() {
            if (EnvConfigService.get('useMockData')) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(window.DashboardMockData.getSummary());
                    }, 500);
                });
            }
            return RestApiService.get('/dashboard/summary');
        }
    }
})();