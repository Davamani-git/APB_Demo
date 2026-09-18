(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .factory('fraudRiskFactory', ['$http', 'API_ENDPOINTS', function($http, API_ENDPOINTS) {
      return {
        evaluateRisk: function(transaction) {
          return $http.post(API_ENDPOINTS.riskEngine, transaction)
            .then(function(response) {
              return {
                transactionId: transaction.transactionId,
                score: response.data.score,
                level: response.data.level,
                factors: response.data.factors || [],
                timestamp: new Date()
              };
            });
        }
      };
    }]);
})();