(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .factory('RiskThresholdFactory', ['ConfigService', '$q', function(ConfigService, $q) {
      var cachedThresholds = null;
      var cacheTimestamp = null;
      var CACHE_DURATION = 300000;

      return {
        getThresholds: function() {
          var now = Date.now();
          if (cachedThresholds && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
            return $q.resolve(cachedThresholds);
          }

          return ConfigService.getThresholds()
            .then(function(thresholds) {
              cachedThresholds = thresholds;
              cacheTimestamp = now;
              return thresholds;
            })
            .catch(function(error) {
              if (cachedThresholds) {
                return cachedThresholds;
              }
              return ConfigService.getDefaultThresholds();
            });
        },

        clearCache: function() {
          cachedThresholds = null;
          cacheTimestamp = null;
        },

        updateThresholds: function(thresholds) {
          return ConfigService.updateThresholds(thresholds)
            .then(function(updated) {
              cachedThresholds = updated;
              cacheTimestamp = Date.now();
              return updated;
            });
        }
      };
    }]);
})();