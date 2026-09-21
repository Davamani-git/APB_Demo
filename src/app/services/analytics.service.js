(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsService', ['$q', 'TransactionService', function($q, TransactionService) {
    return {
      getCategoryWiseSpend: function() {
        return TransactionService.getAllTransactions().then(function(transactions) {
          var categoryMap = {};
          transactions.forEach(function(t) {
            if (!categoryMap[t.category]) categoryMap[t.category] = 0;
            categoryMap[t.category] += t.amount;
          });
          return categoryMap;
        });
      },
      getMonthlySpendTrend: function() {
        return TransactionService.getAllTransactions().then(function(transactions) {
          var monthMap = {};
          transactions.forEach(function(t) {
            var d = new Date(t.date);
            var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            if (!monthMap[key]) monthMap[key] = 0;
            monthMap[key] += t.amount;
          });
          var sorted = Object.keys(monthMap).sort();
          var labels = sorted;
          var data = sorted.map(function(k) { return monthMap[k]; });
          return {labels: labels, data: data};
        });
      },
      getCardWiseSpend: function() {
        return TransactionService.getAllTransactions().then(function(transactions) {
          var cardMap = {};
          transactions.forEach(function(t) {
            if (!cardMap[t.cardId]) cardMap[t.cardId] = 0;
            cardMap[t.cardId] += t.amount;
          });
          return cardMap;
        });
      }
    };
  }]);
})();