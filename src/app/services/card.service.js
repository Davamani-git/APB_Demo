(function() {
  'use strict';
  angular.module('creditCardApp').factory('CardService', ['$q', function($q) {
    var mockCards = [
      {id: 1, name: 'Visa Platinum', type: 'Visa', lastFour: '4532', creditLimit: 50000, availableCredit: 35000, outstanding: 15000, monthlySpend: 12000},
      {id: 2, name: 'MasterCard Gold', type: 'MasterCard', lastFour: '5412', creditLimit: 30000, availableCredit: 22000, outstanding: 8000, monthlySpend: 6500},
      {id: 3, name: 'Amex Blue', type: 'Amex', lastFour: '3782', creditLimit: 40000, availableCredit: 28000, outstanding: 12000, monthlySpend: 9500}
    ];
    return {
      getAllCards: function() {
        return $q.resolve(angular.copy(mockCards));
      },
      getCardById: function(cardId) {
        var card = mockCards.find(function(c) { return c.id == cardId; });
        return $q.resolve(angular.copy(card));
      },
      getConsolidatedKPIs: function() {
        var totalLimit = 0, totalAvailable = 0, totalOutstanding = 0, totalMonthlySpend = 0;
        mockCards.forEach(function(card) {
          totalLimit += card.creditLimit;
          totalAvailable += card.availableCredit;
          totalOutstanding += card.outstanding;
          totalMonthlySpend += card.monthlySpend;
        });
        return $q.resolve({
          totalCreditLimit: totalLimit,
          availableCredit: totalAvailable,
          outstandingAmount: totalOutstanding,
          monthlySpend: totalMonthlySpend
        });
      }
    };
  }]);
})();