(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .service('transactionIngestionService', ['$http', 'API_ENDPOINTS', '$interval', function($http, API_ENDPOINTS, $interval) {
      const self = this;
      let pollingInterval = null;
      
      self.fetchTransactions = function() {
        return $http.get(API_ENDPOINTS.transactions)
          .then(function(response) {
            return self.normalizeTransactions(response.data);
          });
      };
      
      self.normalizeTransactions = function(transactions) {
        return transactions.map(function(txn) {
          return {
            transactionId: txn.transactionId || txn.id,
            cardId: txn.cardId,
            amount: parseFloat(txn.amount),
            currency: txn.currency || 'USD',
            merchantName: txn.merchantName || txn.merchant,
            merchantCategory: txn.merchantCategory || 'unknown',
            timestamp: new Date(txn.timestamp),
            location: txn.location || {},
            authorizationStatus: txn.authorizationStatus || 'pending'
          };
        });
      };
      
      self.startPolling = function(callback, interval) {
        interval = interval || 10000;
        if (pollingInterval) {
          self.stopPolling();
        }
        pollingInterval = $interval(function() {
          self.fetchTransactions().then(callback);
        }, interval);
      };
      
      self.stopPolling = function() {
        if (pollingInterval) {
          $interval.cancel(pollingInterval);
          pollingInterval = null;
        }
      };
    }]);
})();