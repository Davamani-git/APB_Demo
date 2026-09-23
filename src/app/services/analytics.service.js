(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsService', ['$q', 'TransactionService', function($q, TransactionService) {
    var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    return {
      getCategoryWiseSpending: function(cardId) {
        var promise = cardId ? TransactionService.getTransactionsByCard(cardId) : TransactionService.getAllTransactions();
        return promise.then(function(transactions) {
          var categoryMap = {};
          categories.forEach(function(cat) { categoryMap[cat] = 0; });
          transactions.forEach(function(txn) {
            if (categoryMap.hasOwnProperty(txn.category)) {
              categoryMap[txn.category] += txn.amount;
            }
          });
          return categoryMap;
        });
      },
      getMonthlySpendTrend: function() {
        return TransactionService.getAllTransactions().then(function(transactions) {
          var monthMap = {};
          transactions.forEach(function(txn) {
            var month = txn.date.substring(0, 7);
            monthMap[month] = (monthMap[month] || 0) + txn.amount;
          });
          var months = Object.keys(monthMap).sort();
          var values = months.map(function(m) { return monthMap[m]; });
          return {labels: months, data: values};
        });
      },
      getCardWiseSpending: function() {
        return TransactionService.getAllTransactions().then(function(transactions) {
          var cardMap = {};
          transactions.forEach(function(txn) {
            cardMap[txn.cardId] = (cardMap[txn.cardId] || 0) + txn.amount;
          });
          return cardMap;
        });
      }
    };
  }]);
})();