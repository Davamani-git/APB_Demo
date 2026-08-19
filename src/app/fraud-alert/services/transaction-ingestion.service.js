angular.module('fraudAlert.ingestion')
  .service('TransactionIngestionService', ['$http', '$q', '$rootScope', 'FraudRiskService', 'PolicyDecisionService', 'AuditService', function($http, $q, $rootScope, FraudRiskService, PolicyDecisionService, AuditService) {
    var self = this;
    var processedTransactions = {};
    this.ingestTransaction = function(transactionEvent) {
      var idempotencyKey = transactionEvent.idempotencyKey || transactionEvent.transactionId;
      if (processedTransactions[idempotencyKey]) {
        console.log('Duplicate transaction detected, skipping:', idempotencyKey);
        return $q.resolve({ status: 'duplicate', transactionId: transactionEvent.transactionId });
      }
      processedTransactions[idempotencyKey] = true;
      sessionStorage.setItem('idempotency_' + idempotencyKey, 'processed');
      return FraudRiskService.evaluateRisk(transactionEvent)
        .then(function(riskEvaluation) {
          return PolicyDecisionService.determineAction(transactionEvent, riskEvaluation);
        })
        .then(function(decision) {
          AuditService.logDecision(transactionEvent, decision);
          $rootScope.$broadcast('transaction:processed', {
            transaction: transactionEvent,
            decision: decision
          });
          return decision;
        })
        .catch(function(error) {
          console.error('Transaction ingestion failed:', error);
          AuditService.logEvent('ingestion_error', { transactionId: transactionEvent.transactionId, error: error.message });
          return $q.reject(error);
        });
    };
    this.getProcessedTransactions = function() {
      return Object.keys(processedTransactions);
    };
    this.simulateTransactionEvent = function(transaction) {
      return self.ingestTransaction(transaction);
    };
  }]);