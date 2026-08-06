(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('CreditCardService', ['$http', '$q', function($http, $q) {
      var cache = null;
      var cacheTime = null;
      var CACHE_TTL = 5 * 60 * 1000;
      
      this.getAllCards = function() {
        var now = new Date().getTime();
        if (cache && cacheTime && (now - cacheTime) < CACHE_TTL) {
          return $q.resolve(cache);
        }
        
        return $http.get('/api/creditcards')
          .then(function(response) {
            cache = response.data;
            cacheTime = now;
            return cache;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
      
      this.clearCache = function() {
        cache = null;
        cacheTime = null;
      };
    }]);
})();