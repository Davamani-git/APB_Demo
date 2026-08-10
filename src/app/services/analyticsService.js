(function() {
  'use strict';
  angular.module('creditCardApp').factory('analyticsService', [function() {
    return {
      calculateSpendBreakdown: function(transactions) {
        const breakdown = {};
        transactions.forEach(function(txn) {
          if (!breakdown[txn.cardId]) {
            breakdown[txn.cardId] = {
              cardId: txn.cardId,
              totalSpend: 0,
              transactionCount: 0,
              currency: txn.currency
            };
          }
          breakdown[txn.cardId].totalSpend += txn.amount;
          breakdown[txn.cardId].transactionCount++;
        });
        return Object.values(breakdown);
      }
    };
  }]);
})();