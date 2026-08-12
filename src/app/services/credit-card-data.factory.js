(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
      var apiBase = '/api/creditcards';
      var cachedCards = null;
      return {
        getAllCards: function() {
          return $http.get(apiBase)
            .then(function(response) {
              cachedCards = response.data;
              return response.data;
            })
            .catch(function(error) {
              if (cachedCards) {
                return cachedCards;
              }
              return $q.reject(error);
            });
        },
        getCardById: function(cardId) {
          return $http.get(apiBase + '/' + cardId)
            .then(function(response) {
              return response.data;
            });
        }
      };
    }]);
})();