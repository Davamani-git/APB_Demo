(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .factory('RiskThresholdFactory', ['API_CONFIG', function(API_CONFIG) {
      return {
        getThresholds: function() {
          return {
            low: 30,
            medium: 60,
            high: 80,
            critical: 95
          };
        },
        getActionThreshold: function() {
          return {
            approve: 30,
            monitor: 60,
            alert: 80,
            decline: 95
          };
        }
      };
    }]);
})();