(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPICalculationService', [function() {
      this.aggregateKPIs = function(cards) {
        if (!cards || !cards.length) {
          return {
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstanding: 0,
            totalMonthlySpend: 0,
            cardCount: 0
          };
        }
        
        var kpis = {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          totalMonthlySpend: 0,
          cardCount: cards.length
        };
        
        cards.forEach(function(card) {
          kpis.totalCreditLimit += card.creditLimit || 0;
          kpis.totalAvailableCredit += card.availableCredit || 0;
          kpis.totalOutstanding += card.outstandingAmount || 0;
          kpis.totalMonthlySpend += card.monthlySpend || 0;
        });
        
        return kpis;
      };
    }]);
})();