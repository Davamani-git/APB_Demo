(function() {
  'use strict';
  angular.module('creditDashboardApp').service('AnalyticsService', ['TransactionService', 'CardService', '$q', function(TransactionService, CardService, $q) {
    this.getMonthlyTrends = function(userId) {
      var deferred = $q.defer();
      TransactionService.getTransactions(userId, null, null).then(function(transactions) {
        var monthlyMap = {};
        transactions.forEach(function(txn) {
          var month = txn.txnDate.substring(0, 7);
          if (!monthlyMap[month]) {
            monthlyMap[month] = 0;
          }
          monthlyMap[month] += txn.amount;
        });
        var trends = Object.keys(monthlyMap).sort().map(function(month) {
          return {month: month, spend: monthlyMap[month]};
        });
        deferred.resolve(trends);
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    this.getCategoryWiseSpend = function(userId, month) {
      var deferred = $q.defer();
      TransactionService.getTransactions(userId, null, month).then(function(transactions) {
        var categoryMap = {};
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = 0;
          }
          categoryMap[txn.category] += txn.amount;
        });
        var categoryData = Object.keys(categoryMap).map(function(cat) {
          return {category: cat, spend: categoryMap[cat]};
        });
        deferred.resolve(categoryData);
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    this.getCardWiseSpend = function(userId, month) {
      var deferred = $q.defer();
      $q.all([
        CardService.getCards(userId),
        TransactionService.getTransactions(userId, null, month)
      ]).then(function(results) {
        var cards = results[0];
        var transactions = results[1];
        var cardSpendMap = {};
        cards.forEach(function(card) {
          cardSpendMap[card.id] = {cardId: card.id, maskedNumber: card.maskedNumber, spend: 0};
        });
        transactions.forEach(function(txn) {
          if (cardSpendMap[txn.cardId]) {
            cardSpendMap[txn.cardId].spend += txn.amount;
          }
        });
        var cardWiseData = Object.keys(cardSpendMap).map(function(cid) {
          return cardSpendMap[cid];
        });
        deferred.resolve(cardWiseData);
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
  }]);
  angular.module('creditDashboardApp').service('AnalyticsService').$inject = ['TransactionService', 'CardService', '$q'];
})();