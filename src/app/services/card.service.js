(function() {
  'use strict';
  angular.module('creditCardApp').factory('CardService', ['$q', function($q) {
    var mockCards = [
      {id: 1, name: 'Platinum Rewards', issuer: 'Chase', limit: 15000, balance: 3200, availableCredit: 11800},
      {id: 2, name: 'Cash Back Plus', issuer: 'Citi', limit: 10000, balance: 2100, availableCredit: 7900},
      {id: 3, name: 'Travel Elite', issuer: 'Amex', limit: 20000, balance: 5800, availableCredit: 14200}
    ];
    return {
      getCards: function() {
        return $q.resolve(angular.copy(mockCards));
      },
      getCardById: function(cardId) {
        var card = mockCards.find(function(c) { return c.id === cardId; });
        return $q.resolve(angular.copy(card));
      }
    };
  }]);
})();