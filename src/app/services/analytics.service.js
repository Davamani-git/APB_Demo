angular.module('fraudDetectionModule').service('analyticsService', ['$http', '$q', function($http, $q) {
  const API_BASE = '/api/analytics';
  this.getMetrics = function() {
    return $http.get(API_BASE + '/metrics').then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.error('Failed to fetch metrics:', error);
      return $q.reject(error);
    });
  };
  this.emitEvent = function(eventType, eventData) {
    return $http.post(API_BASE + '/events', {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString()
    }).catch(function(error) {
      console.error('Failed to emit analytics event:', error);
      return $q.reject(error);
    });
  };
  this.getPerformanceStats = function() {
    return $http.get(API_BASE + '/performance').then(function(response) {
      return response.data;
    }).catch(function(error) {
      console.error('Failed to fetch performance stats:', error);
      return $q.reject(error);
    });
  };
}]);