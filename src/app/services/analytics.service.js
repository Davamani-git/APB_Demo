(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsService', ['TransactionService', '$q', function(TransactionService, $q) {
    return {
      getMonthlyTrends: function() {
        return TransactionService.getTransactions().then(function(transactions) {
          var monthlyData = {};
          transactions.forEach(function(t) {
            var d = new Date(t.date);
            var key = d.getFullYear() + '-' + (d.getMonth() + 1);
            if (!monthlyData[key]) monthlyData[key] = 0;
            monthlyData[key] += t.amount;
          });
          var labels = Object.keys(monthlyData).sort();
          var data = labels.map(function(k) { return monthlyData[k]; });
          return {labels: labels, data: data};
        });
      },
      getCategorySpending: function() {
        return TransactionService.getTransactions().then(function(transactions) {
          var categoryData = {};
          transactions.forEach(function(t) {
            if (!categoryData[t.category]) categoryData[t.category] = 0;
            categoryData[t.category] += t.amount;
          });
          var labels = Object.keys(categoryData);
          var data = labels.map(function(k) { return categoryData[k]; });
          return {labels: labels, data: data};
        });
      },
      getCardWiseSpending: function() {
        return $q.all({
          cards: CardService.getCards(),
          transactions: TransactionService.getTransactions()
        }).then(function(result) {
          var cardData = {};
          result.transactions.forEach(function(t) {
            if (!cardData[t.cardId]) cardData[t.cardId] = 0;
            cardData[t.cardId] += t.amount;
          });
          var cardMap = {};
          result.cards.forEach(function(c) { cardMap[c.id] = c.name; });
          var labels = Object.keys(cardData).map(function(id) { return cardMap[id]; });
          var data = Object.keys(cardData).map(function(id) { return cardData[id]; });
          return {labels: labels, data: data};
        });
      }
    };
  }]);
})();