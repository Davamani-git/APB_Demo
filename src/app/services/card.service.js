(function() {
  'use strict';
  angular.module('creditCardApp').factory('CardService', ['$q', function($q) {
    var mockCards = [
      {id: 1, name: 'Platinum Rewards', last4: '4521', creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000},
      {id: 2, name: 'Travel Elite', last4: '8832', creditLimit: 30000, availableCredit: 22000, outstandingBalance: 8000},
      {id: 3, name: 'Cashback Plus', last4: '1234', creditLimit: 20000, availableCredit: 18000, outstandingBalance: 2000}
    ];
    return {
      getAllCards: function() {
        return $q.resolve(angular.copy(mockCards));
      },
      getCardById: function(cardId) {
        var card = mockCards.find(function(c) { return c.id === parseInt(cardId); });
        return $q.resolve(angular.copy(card));
      },
      getConsolidatedKPIs: function() {
        var totalLimit = 0, totalAvailable = 0, totalOutstanding = 0;
        mockCards.forEach(function(card) {
          totalLimit += card.creditLimit;
          totalAvailable += card.availableCredit;
          totalOutstanding += card.outstandingBalance;
        });
        return $q.resolve({
          totalCreditLimit: totalLimit,
          availableCredit: totalAvailable,
          outstandingAmount: totalOutstanding
        });
      }
    };
  }]);
})();