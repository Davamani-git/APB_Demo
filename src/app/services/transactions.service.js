(function () {
    'use strict';

    angular
        .module('app')
        .service('TransactionsService', TransactionsService);

    TransactionsService.$inject = ['RestApiService', '$q', 'EnvConfigService'];

    function TransactionsService(RestApiService, $q, EnvConfigService) {
        this.searchTransactions = searchTransactions;
        this.getRecentTransactions = getRecentTransactions;

        function searchTransactions(filters) {
            if (EnvConfigService.get('useMockData')) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(window.TransactionsMockData.search(filters));
                    }, 400);
                });
            }
            return RestApiService.get('/transactions/search', { params: filters });
        }

        function getRecentTransactions(limit) {
            limit = limit or 5;
            if (EnvConfigService.get('useMockData')) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(window.TransactionsMockData.getRecent(limit));
                    }, 200);
                });
            }
            return RestApiService.get('/transactions/recent', { params: { limit: limit } });
        }
    }
})();