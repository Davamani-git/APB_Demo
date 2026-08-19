angular.module('fraudDetectionApp').service('transactionIngestionService', ['$http', '$q', 'auditService', 'transactionModel', function($http, $q, auditService, transactionModel) {
  const processedTransactions = new Map();
  const API_BASE = '/api/transactions';
  
  this.fetchTransactions = function() {
    return $http.get(API_BASE)
      .then(response => {
        const transactions = response.data || [];
        return this.validateAndDeduplicate(transactions);
      })
      .catch(error => {
        auditService.logError('Transaction ingestion failed', error);
        return $q.reject(error);
      });
  };
  
  this.validateAndDeduplicate = function(transactions) {
    const validTransactions = [];
    
    transactions.forEach(txData => {
      const tx = new transactionModel(txData);
      const validation = tx.validate();
      
      if (!validation.valid) {
        auditService.logError('Transaction validation failed', { transactionId: tx.transactionId, error: validation.error });
        return;
      }
      
      const idempotencyKey = tx.idempotencyKey || tx.transactionId;
      if (processedTransactions.has(idempotencyKey)) {
        auditService.logInfo('Duplicate transaction detected', { idempotencyKey });
        return;
      }
      
      processedTransactions.set(idempotencyKey, tx);
      validTransactions.push(tx);
    });
    
    return validTransactions;
  };
  
  this.getTransactionById = function(transactionId) {
    return $http.get(API_BASE + '/' + transactionId)
      .then(response => new transactionModel(response.data))
      .catch(error => {
        auditService.logError('Failed to fetch transaction', { transactionId, error });
        return $q.reject(error);
      });
  };
}]);