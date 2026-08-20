(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('auditTrailService', ['$http', '$q', 'API_CONFIG', auditTrailService]);

  function auditTrailService($http, $q, API_CONFIG) {
    const auditLog = [];

    this.logRiskDecision = function(decision) {
      const deferred = $q.defer();
      const url = API_CONFIG.baseUrl + API_CONFIG.endpoints.auditLog;
      const auditEntry = {
        transactionId: decision.transactionId,
        riskScore: decision.riskScore,
        riskBand: decision.riskBand,
        fraudSignals: decision.fraudSignals,
        modelVersion: decision.modelVersion,
        timestamp: decision.decisionTimestamp.toISOString(),
        action: decision.action,
        policyThresholds: decision.policyThresholds
      };
      auditLog.push(auditEntry);
      $http.post(url, auditEntry)
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          console.warn('Audit trail API unavailable, logged locally:', error);
          deferred.resolve({ status: 'logged_locally', entry: auditEntry });
        });
      return deferred.promise;
    };

    this.getAuditLog = function() {
      return auditLog;
    };

    this.clearAuditLog = function() {
      auditLog.length = 0;
    };
  }
})();