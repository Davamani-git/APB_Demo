(function() {
  'use strict';
  angular.module('creditCardDashboard').factory('KPICalculator', function() {
    return {
      calculateKPIs: function(cards) {
        var kpis = {
          totalCards: cards.length,
          totalCreditLimit: 0,
          totalOutstanding: 0,
          totalAvailableCredit: 0,
          totalMonthlySpend: 0
        };
        cards.forEach(function(card) {
          kpis.totalCreditLimit += card.totalCreditLimit || 0;
          kpis.totalOutstanding += card.outstandingAmount || 0;
          kpis.totalAvailableCredit += card.availableCredit || 0;
          kpis.totalMonthlySpend += card.monthlySpend || 0;
        });
        return kpis;
      }
    };
  });
})();