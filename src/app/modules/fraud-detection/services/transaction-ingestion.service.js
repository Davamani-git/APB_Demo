(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('TransactionIngestionService', ['$http', '$cacheFactory', 'FraudRiskFactory', 'AuditService', function($http, $cacheFactory, FraudRiskFactory, AuditService) {
      var cache = $cacheFactory('transactionCache');
      var apiUrl = '/api/transactions';
      this.fetchRecentTransactions = function() {
        return $http.get(apiUrl).then(function(response) {
          var transactions = response.data;
          var processedTransactions = [];
          transactions.forEach(function(txn) {
            if (!cache.get(txn.transactionId)) {
              cache.put(txn.transactionId, true);
              AuditService.logEvent('INGESTION', txn);
              processedTransactions.push(txn);
            }
          });
          return processedTransactions;
        });
      };
      this.processTransaction = function(transaction) {
        return FraudRiskFactory.evaluateRisk(transaction).then(function(riskResult) {
          AuditService.logEvent('RISK_EVALUATION', riskResult);
          return riskResult;
        });
      };
    }]);
})();