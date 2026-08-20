(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('cacheService', ['$cacheFactory', function($cacheFactory) {
      const cache = $cacheFactory('fraudDetectionCache');
      const self = this;
      self.get = function(key) {
        const item = cache.get(key);
        if (item && item.expiry > Date.now()) {
          return item.data;
        }
        if (item) {
          cache.remove(key);
        }
        return null;
      };
      self.put = function(key, data, ttl) {
        const item = {
          data: data,
          expiry: Date.now() + (ttl || 60000)
        };
        cache.put(key, item);
      };
      self.remove = function(key) {
        cache.remove(key);
      };
      self.clear = function() {
        cache.removeAll();
      };
    }]);
})();