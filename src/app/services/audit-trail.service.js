(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .service('AuditTrailService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      var self = this;

      self.logDecision = function(policyDecision, riskAssessment) {
        if (!policyDecision || !riskAssessment) {
          return $q.reject('Policy decision and risk assessment are required');
        }

        var payload = {
          transactionId: policyDecision.transactionId,
          riskScore: riskAssessment.riskScore,
          riskLevel: riskAssessment.riskLevel,
          action: policyDecision.action,
          thresholdApplied: policyDecision.thresholdApplied,
          modelVersion: riskAssessment.modelVersion,
          signals: riskAssessment.signals,
          decisionTimestamp: policyDecision.decisionTimestamp,
          evaluatedAt: riskAssessment.evaluatedAt,
          userId: localStorage.getItem('userId') || 'system'
        };

        return $http.post(API_ENDPOINTS.AUDIT_DECISION, payload)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error logging audit trail:', error);
            return $q.reject(error);
          });
      };

      self.logEvent = function(event) {
        var payload = {
          eventType: event.eventType,
          transactionId: event.transactionId,
          riskLevel: event.riskLevel,
          timestamp: event.timestamp,
          userId: localStorage.getItem('userId') || 'system'
        };

        return $http.post(API_ENDPOINTS.AUDIT_DECISION, payload)
          .catch(function(error) {
            console.error('Error logging event:', error);
          });
      };
    }]);
})();