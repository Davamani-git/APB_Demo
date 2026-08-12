(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardService', ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q) {
      var self = this;
      var cache = $cacheFactory('cardCache');
      self.getCardDetails = function(cardIds) {
        if (!cardIds || cardIds.length === 0) {
          return $q.resolve([]);
        }
        var cachedCards = [];
        var uncachedIds = [];
        cardIds.forEach(function(id) {
          var cached = cache.get('card_' + id);
          if (cached) {
            cachedCards.push(cached);
          } else {
            uncachedIds.push(id);
          }
        });
        if (uncachedIds.length === 0) {
          return $q.resolve(cachedCards);
        }
        return $http.get('/api/cards', { params: { ids: uncachedIds.join(',') } }).then(function(response) {
          var cards = response.data;
          cards.forEach(function(card) {
            cache.put('card_' + card.cardId, card);
          });
          return cachedCards.concat(cards);
        }).catch(function(error) {
          console.error('Error fetching card details:', error);
          return $q.reject(error);
        });
      };
    }]);
})();