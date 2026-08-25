(function() {
  'use strict';
  angular.module('dashboard')
    .factory('KPICalculator', [function() {
      return {
        computeKPIs: function(cards, transactions) {
          const kpis = {
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstanding: 0,
            monthlySpend: 0,
            cardCount: cards.length
          };
          
          cards.forEach(function(card) {
            kpis.totalCreditLimit += card.creditLimit || 0;
            kpis.totalAvailableCredit += card.availableCredit || 0;
            kpis.totalOutstanding += card.outstandingAmount || 0;
          });
          
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          kpis.monthlySpend = transactions.reduce(function(sum, transaction) {
            const transactionDate = new Date(transaction.transactionDate);
            if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
              return sum + (transaction.amount || 0);
            }
            return sum;
          }, 0);
          
          return kpis;
        }
      };
    }]);
})();