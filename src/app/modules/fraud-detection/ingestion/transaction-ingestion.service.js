(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .factory('TransactionIngestionService', ['$http', '$q', 'IdempotencyService', function($http, $q, IdempotencyService) {
      return {
        ingestTransaction: function(transaction) {
          if (!transaction.idempotencyKey) {
            return $q.reject('Missing idempotency key');
          }
          return IdempotencyService.checkKey(transaction.idempotencyKey)
            .then(function() {
              return $http.post('/api/transactions/ingest', transaction);
            })
            .then(function(response) {
              return IdempotencyService.storeKey(transaction.idempotencyKey)
                .then(function() {
                  return response.data;
                });
            });
        },
        validateTransaction: function(transaction) {
          var required = ['transactionId', 'accountId', 'cardId', 'merchant', 'amount', 'currency', 'timestamp'];
          for (var i = 0; i < required.length; i++) {
            if (!transaction[required[i]]) {
              return $q.reject('Missing required field: ' + required[i]);
            }
          }
          return $q.resolve(transaction);
        },
        normalizeTransaction: function(transaction) {
          return {
            transactionId: transaction.transactionId,
            accountId: transaction.accountId,
            cardId: transaction.cardId,
            merchant: transaction.merchant,
            amount: parseFloat(transaction.amount),
            currency: transaction.currency,
            timestamp: new Date(transaction.timestamp),
            channel: transaction.channel || 'unknown',
            location: transaction.location || {},
            deviceId: transaction.deviceId || null,
            idempotencyKey: transaction.idempotencyKey
          };
        }
      };
    }]);
})();