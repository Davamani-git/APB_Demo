(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('transactionFilter', function() {
      return function(transactions, searchTerm) {
        if (!searchTerm) return transactions;
        var term = searchTerm.toLowerCase();
        return transactions.filter(function(transaction) {
          return (transaction.merchant && transaction.merchant.toLowerCase().indexOf(term) !== -1) ||
                 (transaction.description && transaction.description.toLowerCase().indexOf(term) !== -1);
        });
      };
    });
})();