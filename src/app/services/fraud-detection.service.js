(function() {
  'use strict';
  angular.module('shoppingPlatform').service('FraudDetectionService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
    this.validateTransaction = function(transactionData) {
      return $http.post(API_CONFIG.baseUrl + '/api/fraud/check', transactionData).then(function(response) {
        return response.data;
      });
    };
    this.checkFraudScore = function(transactionData) {
      return this.validateTransaction(transactionData).then(function(result) {
        if (result.fraudScore > 0.7) {
          return {
            approved: false,
            reason: 'High fraud risk detected',
            score: result.fraudScore
          };
        }
        return {
          approved: true,
          score: result.fraudScore
        };
      });
    };
  }]);
})();