angular.module('fraudDetection').service('AuditLogService', ['$http', '$q', 'AnalyticsTrackerFactory', function($http, $q, AnalyticsTrackerFactory) {
  var API_BASE = '/api';
  var localLogs = [];
  
  this.logEvent = function(eventType, eventData) {
    var logEntry = {
      eventId: 'EVT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      eventType: eventType,
      eventData: eventData,
      timestamp: new Date(),
      source: 'fraud-detection-ui'
    };
    localLogs.push(logEntry);
    AnalyticsTrackerFactory.trackEvent(eventType, eventData);
    return $http.post(API_BASE + '/audit/log', logEntry).then(function(response) {
      return response.data;
    }).catch(function(error) {
      return $q.resolve({error: 'Audit log failed', logged: false});
    });
  };
  
  this.getAuditLogs = function(filters) {
    var params = filters || {};
    return $http.get(API_BASE + '/audit/logs', {params: params}).then(function(response) {
      return response.data;
    }).catch(function(error) {
      return localLogs;
    });
  };
  
  this.logDecision = function(transactionId, decision) {
    return this.logEvent('risk_decision', {
      transactionId: transactionId,
      decision: decision
    });
  };
}]);