angular.module('fraudDetection').service('TransactionIngestionService', ['$http', '$q', 'IdempotencyService', 'FraudRiskEngineService', 'AuditLogService', function($http, $q, IdempotencyService, FraudRiskEngineService, AuditLogService) {
  var self = this;
  var API_BASE = '/api';
  
  this.processTransaction = function(transactionEvent) {
    if (!transactionEvent || !transactionEvent.transactionId) {
      return $q.reject({error: 'Invalid transaction event'});
    }
    if (IdempotencyService.isDuplicate(transactionEvent.transactionId)) {
      return $q.reject({error: 'Duplicate transaction', transactionId: transactionEvent.transactionId});
    }
    IdempotencyService.markProcessed(transactionEvent.transactionId);
    var enrichedEvent = self.enrichTransaction(transactionEvent);
    return FraudRiskEngineService.evaluateTransaction(enrichedEvent).then(function(riskScore) {
      AuditLogService.logEvent('transaction_processed', {
        transactionId: transactionEvent.transactionId,
        riskScore: riskScore.overallScore,
        riskLevel: riskScore.riskLevel
      });
      return {transaction: enrichedEvent, riskScore: riskScore};
    }).catch(function(error) {
      AuditLogService.logEvent('transaction_processing_error', {
        transactionId: transactionEvent.transactionId,
        error: error
      });
      return $q.reject(error);
    });
  };
  
  this.enrichTransaction = function(transaction) {
    var enriched = angular.copy(transaction);
    enriched.processedAt = new Date();
    enriched.deviceFingerprint = enriched.deviceFingerprint || 'unknown';
    return enriched;
  };
  
  this.getRecentTransactions = function(filters) {
    var params = filters || {};
    return $http.get(API_BASE + '/transactions', {params: params}).then(function(response) {
      return response.data;
    }).catch(function(error) {
      return $q.reject(error);
    });
  };
  
  this.subscribeToTransactionEvents = function(callback) {
    return callback;
  };
}]);