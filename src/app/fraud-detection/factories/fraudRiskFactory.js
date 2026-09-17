angular.module('fraudDetectionModule').factory('fraudRiskFactory', ['$resource', '$q', function($resource, $q) {
  const RiskAPI = $resource('/api/fraud-risk/score', {}, {
    calculate: {
      method: 'POST',
      isArray: false
    }
  });
  return {
    getRiskScore: function(transaction) {
      const payload = {
        transactionId: transaction.transactionId,
        cardId: transaction.cardId,
        amount: transaction.amount,
        merchantId: transaction.merchantId,
        merchantCategory: transaction.merchantCategory,
        location: transaction.location,
        timestamp: transaction.timestamp
      };
      return RiskAPI.calculate(payload).$promise.then(function(response) {
        return {
          score: response.riskScore || 0,
          band: response.riskBand || 'low',
          factors: response.riskFactors || []
        };
      }).catch(function(error) {
        console.error('Risk score calculation failed:', error);
        return $q.reject(error);
      });
    }
  };
}]);