(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('policyDecisionService', ['$http', '$q', 'auditTrailService', 'riskDecisionModel', 'API_CONFIG', policyDecisionService]);

  function policyDecisionService($http, $q, auditTrailService, riskDecisionModel, API_CONFIG) {
    let cachedThresholds = null;

    this.applyPolicyThresholds = function(transactionData) {
      const deferred = $q.defer();
      this.getPolicyThresholds()
        .then(function(thresholds) {
          const riskScore = transactionData.riskScore;
          let riskBand = 'low';
          let action = 'allow';
          if (riskScore >= thresholds.high) {
            riskBand = 'high';
            action = 'block';
          } else if (riskScore >= thresholds.medium) {
            riskBand = 'medium';
            action = 'review';
          } else if (riskScore >= thresholds.low) {
            riskBand = 'low';
            action = 'allow';
          }
          const decision = riskDecisionModel.create({
            transactionId: transactionData.transaction.transactionId,
            riskScore: riskScore,
            riskBand: riskBand,
            fraudSignals: transactionData.fraudSignals,
            modelVersion: transactionData.modelVersion,
            decisionTimestamp: new Date(),
            policyThresholds: thresholds,
            action: action,
            merchantName: transactionData.transaction.merchantName,
            merchantCategory: transactionData.transaction.merchantCategory,
            amount: transactionData.transaction.amount,
            currency: transactionData.transaction.currency,
            location: transactionData.transaction.location
          });
          auditTrailService.logRiskDecision(decision);
          deferred.resolve(decision);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };

    this.getPolicyThresholds = function() {
      if (cachedThresholds) {
        return $q.resolve(cachedThresholds);
      }
      const deferred = $q.defer();
      const url = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $http.get(url)
        .then(function(response) {
          cachedThresholds = response.data.thresholds || { low: 30, medium: 60, high: 85 };
          deferred.resolve(cachedThresholds);
        })
        .catch(function(error) {
          console.warn('Policy thresholds API unavailable, using defaults:', error);
          cachedThresholds = { low: 30, medium: 60, high: 85 };
          deferred.resolve(cachedThresholds);
        });
      return deferred.promise;
    };

    this.clearCache = function() {
      cachedThresholds = null;
    };
  }
})();