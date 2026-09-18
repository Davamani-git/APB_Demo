(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .service('TransactionIngestionService', ['$http', '$q', 'FraudRiskEngineService', 'AuditService', function($http, $q, FraudRiskEngineService, AuditService) {
      const processedTransactions = new Set();
      
      this.ingestTransaction = function(transactionEvent) {
        if (!this.validateTransaction(transactionEvent)) {
          return $q.reject({ error: 'Invalid transaction data' });
        }
        
        if (this.isDuplicate(transactionEvent.transaction_id)) {
          return $q.reject({ error: 'Duplicate transaction' });
        }
        
        processedTransactions.add(transactionEvent.transaction_id);
        
        transactionEvent.timestamp = transactionEvent.timestamp || new Date().toISOString();
        
        return FraudRiskEngineService.evaluateRisk(transactionEvent)
          .then(function(riskAssessment) {
            return {
              transaction: transactionEvent,
              risk: riskAssessment
            };
          })
          .catch(function(error) {
            processedTransactions.delete(transactionEvent.transaction_id);
            AuditService.log({
              type: 'ingestion_error',
              data: { transaction_id: transactionEvent.transaction_id, error: error }
            });
            return $q.reject(error);
          });
      };
      
      this.validateTransaction = function(transaction) {
        return transaction &&
          transaction.transaction_id &&
          transaction.account_id &&
          transaction.card_id &&
          transaction.merchant &&
          typeof transaction.amount === 'number' &&
          transaction.amount > 0 &&
          transaction.currency &&
          transaction.channel;
      };
      
      this.isDuplicate = function(transactionId) {
        return processedTransactions.has(transactionId);
      };
    }]);
})();