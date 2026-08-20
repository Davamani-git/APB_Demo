(function() {
  'use strict';
  angular.module('fraudDetection')
    .factory('IdempotencyService', ['$cacheFactory', '$http', '$q', function($cacheFactory, $http, $q) {
      var cache = $cacheFactory('idempotencyCache');
      return {
        checkKey: function(key) {
          if (cache.get(key)) {
            return $q.reject('Duplicate idempotency key');
          }
          return $http.get('/api/idempotency/check/' + key)
            .then(function(response) {
              if (response.data.exists) {
                return $q.reject('Duplicate idempotency key');
              }
              cache.put(key, true);
              return true;
            });
        },
        storeKey: function(key) {
          cache.put(key, true);
          return $http.post('/api/idempotency/store', { key: key });
        }
      };
    }]);
})();