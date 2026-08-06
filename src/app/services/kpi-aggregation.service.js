(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIAggregationService', ['CreditCardAPIFactory', '$q', function(CreditCardAPIFactory, $q) {
      var cachedKPIs = null;
      var cacheTimestamp = null;
      var cacheTTL = 120000;
      this.getAggregatedKPIs = function() {
        if (cachedKPIs && cacheTimestamp && (Date.now() - cacheTimestamp < cacheTTL)) {
          return $q.resolve(cachedKPIs);
        }
        return CreditCardAPIFactory.fetchCreditCardData()
          .then(function(cards) {
            var kpis = {
              monthlySpend: 0,
              totalCreditLimit: 0,
              availableCredit: 0,
              outstandingAmount: 0,
              cards: cards,
              lastUpdated: new Date()
            };
            cards.forEach(function(card) {
              kpis.totalCreditLimit += card.creditLimit || 0;
              kpis.availableCredit += card.availableCredit || 0;
              kpis.outstandingAmount += card.outstandingBalance || 0;
            });
            kpis.monthlySpend = kpis.outstandingAmount;
            cachedKPIs = kpis;
            cacheTimestamp = Date.now();
            return kpis;
          });
      };
      this.clearCache = function() {
        cachedKPIs = null;
        cacheTimestamp = null;
      };
    }]);
})();