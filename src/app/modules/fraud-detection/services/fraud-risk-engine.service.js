(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .service('FraudRiskEngineService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.evaluateRisk = function(transaction) {
        return $http.post(API_CONFIG.fraudRiskEngineUrl + '/evaluate', transaction)
          .then(function(response) {
            return {
              transaction_id: transaction.transaction_id,
              risk_score: response.data.risk_score,
              risk_band: response.data.risk_band,
              evaluated_at: new Date().toISOString()
            };
          })
          .catch(function(error) {
            return $q.reject({
              error: 'Risk evaluation failed',
              details: error
            });
          });
      };
    }]);
})();