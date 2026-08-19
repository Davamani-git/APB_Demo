(function() {
  'use strict';
  angular.module('fraudAlert.ingestion')
    .service('TransactionIngestionService', ['$http', '$q', '$interval', 'AuditTrailService', 'API_ENDPOINTS', function($http, $q, $interval, AuditTrailService, API_ENDPOINTS) {
      var self = this;
      var listeners = [];
      var processedTransactions = {};
      var pollingInterval = null;

      self.subscribe = function(callback) {
        listeners.push(callback);
        if (!pollingInterval) {
          self.startPolling();
        }
      };

      self.unsubscribe = function(callback) {
        var index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
        if (listeners.length === 0 && pollingInterval) {
          $interval.cancel(pollingInterval);
          pollingInterval = null;
        }
      };

      self.startPolling = function() {
        pollingInterval = $interval(function() {
          self.fetchTransactions();
        }, 5000);
      };

      self.fetchTransactions = function() {
        return $http.get(API_ENDPOINTS.TRANSACTIONS)
          .then(function(response) {
            var transactions = response.data;
            if (Array.isArray(transactions)) {
              transactions.forEach(function(transaction) {
                if (!processedTransactions[transaction.transactionId]) {
                  var normalized = self.normalizeTransaction(transaction);
                  if (self.validateTransaction(normalized)) {
                    processedTransactions[transaction.transactionId] = true;
                    self.notifyListeners(normalized);
                  }
                }
              });
            }
            return transactions;
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            return $q.reject(error);
          });
      };

      self.validateTransaction = function(transaction) {
        return transaction &&
               transaction.transactionId &&
               transaction.amount !== undefined &&
               transaction.merchantId &&
               transaction.transactionTimestamp;
      };

      self.normalizeTransaction = function(transaction) {
        return {
          transactionId: transaction.transactionId,
          cardNumber: self.maskCardNumber(transaction.cardNumber),
          amount: parseFloat(transaction.amount),
          currency: transaction.currency || 'USD',
          merchantId: transaction.merchantId,
          merchantName: transaction.merchantName,
          merchantCategory: transaction.merchantCategory,
          transactionTimestamp: new Date(transaction.transactionTimestamp),
          location: transaction.location || {},
          authorizationStatus: transaction.authorizationStatus || 'approved',
          cardCompromisedFlag: transaction.cardCompromisedFlag || false,
          eventVersion: transaction.eventVersion || '1.0'
        };
      };

      self.maskCardNumber = function(cardNumber) {
        if (!cardNumber) return '****';
        var str = String(cardNumber);
        if (str.length <= 4) return '****';
        return '****' + str.slice(-4);
      };

      self.notifyListeners = function(transaction) {
        listeners.forEach(function(callback) {
          callback(transaction);
        });
      };
    }]);
})();