angular.module('fraudDetectionApp').service('TransactionIngestionService', ['$http', '$q', 'IdempotencyService', function($http, $q, IdempotencyService) {
  var self = this;
  var API_BASE = '/api/transactions';

  this.ingestTransaction = function(transactionEvent) {
    if (!transactionEvent || !transactionEvent.transactionId) {
      return $q.reject({ error: 'Invalid transaction event' });
    }
    if (IdempotencyService.isDuplicate(transactionEvent.transactionId)) {
      return $q.reject({ error: 'Duplicate transaction', transactionId: transactionEvent.transactionId });
    }
    var validationResult = self.validateTransaction(transactionEvent);
    if (!validationResult.valid) {
      return $q.reject({ error: 'Validation failed', details: validationResult.errors });
    }
    IdempotencyService.markProcessed(transactionEvent.transactionId);
    return $http.post(API_BASE, transactionEvent).then(function(response) {
      return response.data;
    }).catch(function(error) {
      IdempotencyService.clearProcessed(transactionEvent.transactionId);
      return $q.reject(error);
    });
  };

  this.validateTransaction = function(transaction) {
    var errors = [];
    if (!transaction.cardIdentifier) errors.push('Missing cardIdentifier');
    if (!transaction.amount || transaction.amount <= 0) errors.push('Invalid amount');
    if (!transaction.currency) errors.push('Missing currency');
    if (!transaction.merchantName) errors.push('Missing merchantName');
    if (!transaction.timestamp) errors.push('Missing timestamp');
    return { valid: errors.length === 0, errors: errors };
  };

  this.getTransactionById = function(transactionId) {
    return $http.get(API_BASE + '/' + transactionId).then(function(response) {
      return response.data;
    });
  };

  this.getRecentTransactions = function(limit) {
    return $http.get(API_BASE + '/recent', { params: { limit: limit || 50 } }).then(function(response) {
      return response.data;
    });
  };
}]);