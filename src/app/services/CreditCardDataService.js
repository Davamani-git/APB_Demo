(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataService', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT) {
      var cache = null;
      var cacheTime = null;
      var TTL = 60000;
      return {
        fetchAllCards: function() {
          if (cache && cacheTime && (Date.now() - cacheTime < TTL)) {
            return $q.resolve(cache);
          }
          return $http.get(API_ENDPOINT + '/creditcards')
            .then(function(response) {
              cache = response.data;
              cacheTime = Date.now();
              return cache;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        clearCache: function() {
          cache = null;
          cacheTime = null;
        }
      };
    }]);
})();