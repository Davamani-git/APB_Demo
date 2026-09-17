(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('FraudRiskFactory', ['$http', '$q', function($http, $q) {
      var apiUrl = '/api/risk/evaluate';
      return {
        evaluateRisk: function(transactionEvent) {
          return $http.post(apiUrl, transactionEvent).then(function(response) {
            var result = response.data;
            return {
              transactionId: result.transactionId || transactionEvent.transactionId,
              riskScore: result.riskScore,
              riskLevel: result.riskLevel,
              decision: result.decision,
              evaluatedAt: new Date(result.evaluatedAt),
              modelVersion: result.modelVersion
            };
          }).catch(function(error) {
            console.error('Risk evaluation failed:', error);
            return $q.reject(error);
          });
        }
      };
    }]);
})();