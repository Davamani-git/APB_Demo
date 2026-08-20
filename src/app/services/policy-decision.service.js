(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('policyDecisionService', ['$http', '$q', 'apiConfig', 'configService', function($http, $q, apiConfig, configService) {
      const self = this;
      self.applyPolicy = function(riskScore, transactionId) {
        return configService.getThresholds().then(function(thresholds) {
          const payload = {
            riskScore: riskScore,
            transactionId: transactionId,
            thresholds: thresholds
          };
          return $http.get(apiConfig.baseUrl + apiConfig.endpoints.policyDecision, {
            params: payload,
            timeout: apiConfig.timeout
          }).then(function(response) {
            return response.data;
          });
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
      self.determineRiskBand = function(riskScore, thresholds) {
        if (riskScore < thresholds.lowRiskThreshold) {
          return 'low';
        } else if (riskScore < thresholds.mediumRiskThreshold) {
          return 'medium';
        } else if (riskScore < thresholds.highRiskThreshold) {
          return 'high';
        } else {
          return 'critical';
        }
      };
    }]);
})();