(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
      var self = this;
      var cache = $cacheFactory('creditCardCache');
      var CACHE_TTL = 30000;
      self.getAllCards = function() {
        var cachedData = cache.get('allCards');
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
          return $q.resolve(cachedData.data);
        }
        return $http.get('/api/creditcards').then(function(response) {
          var cards = response.data.map(function(card) {
            return {
              cardId: card.cardId,
              cardNumber: card.cardNumber,
              cardType: card.cardType,
              creditLimit: card.creditLimit,
              availableCredit: card.availableCredit,
              outstandingAmount: card.outstandingAmount,
              monthlySpend: card.monthlySpend,
              lastUpdated: new Date(card.lastUpdated)
            };
          });
          cache.put('allCards', { data: cards, timestamp: Date.now() });
          return cards;
        }).catch(function(error) {
          console.error('Error fetching credit cards:', error);
          return $q.reject(error);
        });
      };
      self.getCardById = function(cardId) {
        return $http.get('/api/creditcards/' + cardId).then(function(response) {
          return response.data;
        });
      };
    }]);
})();