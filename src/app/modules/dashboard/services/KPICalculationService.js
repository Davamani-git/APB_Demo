(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .factory('KPICalculationService', ['AggregationService', function(AggregationService) {
      return {
        getKPIs: function() {
          return AggregationService.aggregateCardData().then(function(cards) {
            var kpis = cards.reduce(function(acc, card) {
              acc.totalCreditLimit += card.creditLimit || 0;
              acc.totalAvailableCredit += card.availableCredit || 0;
              acc.totalOutstanding += card.outstandingAmount || 0;
              acc.monthlySpend += card.currentBalance || 0;
              return acc;
            }, {
              monthlySpend: 0,
              totalCreditLimit: 0,
              totalAvailableCredit: 0,
              totalOutstanding: 0,
              cardCount: cards.length
            });
            return kpis;
          });
        }
      };
    }]);
})();