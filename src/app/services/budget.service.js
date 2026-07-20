(function () {
    'use strict';

    angular
        .module('app')
        .service('BudgetService', BudgetService);

    BudgetService.$inject = ['RestApiService', '$q', 'EnvConfigService'];

    function BudgetService(RestApiService, $q, EnvConfigService) {
        this.getBudgetSummary = getBudgetSummary;

        function getBudgetSummary() {
            if (EnvConfigService.get('useMockData')) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(window.BudgetMockData.getSummary());
                    }, 300);
                });
            }
            return RestApiService.get('/budget/summary');
        }
    }
})();