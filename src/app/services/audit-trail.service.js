(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('auditTrailService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      const self = this;
      self.logDecision = function(transaction, decision, riskAssessment) {
        const auditEntry = {
          transactionId: transaction.transactionId,
          timestamp: new Date().toISOString(),
          riskScore: riskAssessment.riskScore,
          riskBand: decision.riskBand,
          alertTriggered: decision.alertTriggered,
          action: decision.action,
          riskSignals: riskAssessment.riskSignals
        };
        return $http.post(apiConfig.baseUrl + apiConfig.endpoints.auditLog, auditEntry, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
      self.getAuditHistory = function(transactionId) {
        return $http.get(apiConfig.baseUrl + apiConfig.endpoints.auditLog + '/' + transactionId, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
    }]);
})();