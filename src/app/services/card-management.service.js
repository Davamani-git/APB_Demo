(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardManagementService', ['CardDataFactory', '$q', function(CardDataFactory, $q) {
      var cachedCards = null;
      var selectedCard = null;
      this.getCards = function() {
        if (cachedCards) {
          return $q.resolve(cachedCards);
        }
        return CardDataFactory.fetchCards()
          .then(function(cards) {
            cachedCards = cards.slice(0, 10);
            if (cachedCards.length > 0 && !selectedCard) {
              selectedCard = cachedCards[0];
            }
            return cachedCards;
          });
      };
      this.setSelectedCard = function(card) {
        selectedCard = card;
      };
      this.getSelectedCard = function() {
        return selectedCard;
      };
      this.clearCache = function() {
        cachedCards = null;
      };
    }]);
})();