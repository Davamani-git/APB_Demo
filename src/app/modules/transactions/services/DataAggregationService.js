(function() {
  'use strict';
  angular.module('transactionModule')
    .factory('DataAggregationService', ['TransactionService', function(TransactionService) {
      return {
        getAggregatedTransactions: function() {
          return TransactionService.fetchTransactions().then(function(transactions) {
            return transactions.sort(function(a, b) {
              return b.transactionDate - a.transactionDate;
            });
          });
        }
      };
    }]);
})();