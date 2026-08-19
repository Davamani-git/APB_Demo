angular.module('fraudDetectionApp').factory('ThresholdConfigFactory', ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q) {
  var cache = $cacheFactory('thresholdCache');
  var API_BASE = '/api/thresholds';
  var CACHE_KEY = 'thresholds';

  return {
    getThresholds: function() {
      var cached = cache.get(CACHE_KEY);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_BASE).then(function(response) {
        cache.put(CACHE_KEY, response.data);
        return response.data;
      });
    },

    getThresholdById: function(thresholdId) {
      return $http.get(API_BASE + '/' + thresholdId).then(function(response) {
        return response.data;
      });
    },

    createThreshold: function(threshold) {
      return $http.post(API_BASE, threshold).then(function(response) {
        cache.remove(CACHE_KEY);
        return response.data;
      });
    },

    updateThreshold: function(thresholdId, updates) {
      return $http.put(API_BASE + '/' + thresholdId, updates).then(function(response) {
        cache.remove(CACHE_KEY);
        return response.data;
      });
    },

    deleteThreshold: function(thresholdId) {
      return $http.delete(API_BASE + '/' + thresholdId).then(function(response) {
        cache.remove(CACHE_KEY);
        return response.data;
      });
    },

    clearCache: function() {
      cache.remove(CACHE_KEY);
    }
  };
}]);