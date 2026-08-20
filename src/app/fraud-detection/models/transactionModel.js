(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('transactionModel', [transactionModel]);

  function transactionModel() {
    function TransactionEvent(data) {
      this.transactionId = data.transactionId || '';
      this.cardIdentifier = data.cardIdentifier || '';
      this.amount = data.amount || 0;
      this.currency = data.currency || 'USD';
      this.merchantId = data.merchantId || '';
      this.merchantName = data.merchantName || '';
      this.merchantCategory = data.merchantCategory || '';
      this.location = data.location || { latitude: 0, longitude: 0, country: '' };
      this.timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
      this.authorizationStatus = data.authorizationStatus || 'pending';
    }

    TransactionEvent.prototype.isValid = function() {
      return this.transactionId && this.cardIdentifier && this.amount > 0 && this.merchantId;
    };

    TransactionEvent.prototype.toJSON = function() {
      return {
        transactionId: this.transactionId,
        cardIdentifier: this.cardIdentifier,
        amount: this.amount,
        currency: this.currency,
        merchantId: this.merchantId,
        merchantName: this.merchantName,
        merchantCategory: this.merchantCategory,
        location: this.location,
        timestamp: this.timestamp.toISOString(),
        authorizationStatus: this.authorizationStatus
      };
    };

    return {
      create: function(data) {
        return new TransactionEvent(data);
      },
      validate: function(transaction) {
        return transaction.isValid();
      }
    };
  }
})();