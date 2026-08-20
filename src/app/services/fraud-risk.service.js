(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('fraudRiskService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      const self = this;
      self.evaluateRisk = function(transaction) {
        if (!transaction || !transaction.transactionId) {
          return $q.reject({message: 'Invalid transaction data'});
        }
        return $http.post(apiConfig.baseUrl + apiConfig.endpoints.riskEvaluate, transaction, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
      self.batchEvaluate = function(transactions) {
        const promises = transactions.map(function(txn) {
          return self.evaluateRisk(txn);
        });
        return $q.all(promises);
      };
    }]);
})();