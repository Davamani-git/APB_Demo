(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['TransactionDataFactory', function(TransactionDataFactory) {
      this.getTransactions = function(cardId, filters) {
        return TransactionDataFactory.fetchTransactions(cardId, filters);
      };
    }]);
})();