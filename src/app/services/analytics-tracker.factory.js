angular.module('fraudDetection').factory('AnalyticsTrackerFactory', ['$http', '$q', function($http, $q) {
  var API_BASE = '/api';
  var metrics = {
    totalEvents: 0,
    eventsByType: {}
  };
  
  return {
    trackEvent: function(eventType, eventData) {
      metrics.totalEvents++;
      metrics.eventsByType[eventType] = (metrics.eventsByType[eventType] || 0) + 1;
      var payload = {
        eventType: eventType,
        eventData: eventData,
        timestamp: new Date(),
        sessionId: 'SESSION-' + Date.now()
      };
      return $http.post(API_BASE + '/analytics/track', payload).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.resolve({tracked: false});
      });
    },
    getMetrics: function() {
      return metrics;
    },
    trackModelPerformance: function(modelVersion, performance) {
      return $http.post(API_BASE + '/analytics/model-performance', {
        modelVersion: modelVersion,
        performance: performance,
        timestamp: new Date()
      }).then(function(response) {
        return response.data;
      });
    },
    trackModelDrift: function(driftMetrics) {
      return $http.post(API_BASE + '/analytics/model-drift', {
        driftMetrics: driftMetrics,
        timestamp: new Date()
      }).then(function(response) {
        return response.data;
      });
    }
  };
}]);