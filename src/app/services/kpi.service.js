(function() {
  'use strict';
  angular.module('creditCardApp').factory('KpiService', ['CardService', 'TransactionService', '$q', function(CardService, TransactionService, $q) {
    return {
      calculateKpis: function() {
        return $q.all({
          cards: CardService.getCards(),
          transactions: TransactionService.getTransactions()
        }).then(function(data) {
          var cards = data.cards;
          var transactions = data.transactions;
          var totalLimit = cards.reduce(function(sum, c) { return sum + c.limit; }, 0);
          var totalBalance = cards.reduce(function(sum, c) { return sum + c.balance; }, 0);
          var totalAvailable = cards.reduce(function(sum, c) { return sum + c.availableCredit; }, 0);
          var currentMonth = new Date().getMonth();
          var currentYear = new Date().getFullYear();
          var monthlySpend = transactions.filter(function(t) {
            var d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          }).reduce(function(sum, t) { return sum + t.amount; }, 0);
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalLimit,
            availableCredit: totalAvailable,
            outstandingAmount: totalBalance
          };
        });
      }
    };
  }]);
})();