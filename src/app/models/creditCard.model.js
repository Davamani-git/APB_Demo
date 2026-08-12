(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardModel', function() {
      function CreditCard(data) {
        this.cardId = data.cardId || '';
        this.cardNumber = data.cardNumber || '';
        this.cardType = data.cardType || '';
        this.creditLimit = data.creditLimit || 0;
        this.availableCredit = data.availableCredit || 0;
        this.outstandingAmount = data.outstandingAmount || 0;
        this.monthlySpend = data.monthlySpend || 0;
        this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
      }
      return CreditCard;
    });
})();