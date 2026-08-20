(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('transactionIngestionService', ['$http', '$q', 'apiConfig', 'cacheService', function($http, $q, apiConfig, cacheService) {
      const self = this;
      self.fetchTransactions = function() {
        const cacheKey = 'transactions_list';
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return $q.resolve(cached);
        }
        return $http.get(apiConfig.baseUrl + apiConfig.endpoints.transactions, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          const transactions = response.data;
          cacheService.put(cacheKey, transactions, 30000);
          return transactions;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
      self.getTransactionById = function(transactionId) {
        return $http.get(apiConfig.baseUrl + apiConfig.endpoints.transactions + '/' + transactionId, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
    }]);
})();