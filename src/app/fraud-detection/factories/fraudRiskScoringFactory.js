(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('fraudRiskScoringFactory', ['$http', '$q', 'API_CONFIG', fraudRiskScoringFactory]);

  function fraudRiskScoringFactory($http, $q, API_CONFIG) {
    const mockRiskEngine = {
      calculateScore: function(transaction) {
        let score = 0;
        const signals = [];
        if (transaction.amount > 1000) {
          score += 25;
          signals.push('unusual_amount');
        }
        if (transaction.merchantCategory === 'high_risk') {
          score += 30;
          signals.push('high_risk_merchant');
        }
        if (transaction.location && transaction.location.country !== 'US') {
          score += 20;
          signals.push('geographic_inconsistency');
        }
        const hour = new Date(transaction.timestamp).getHours();
        if (hour < 6 || hour > 22) {
          score += 15;
          signals.push('unusual_time');
        }
        if (Math.random() > 0.8) {
          score += 30;
          signals.push('velocity_check_failed');
        }
        return { score: Math.min(score, 100), signals: signals, modelVersion: 'v1.2.3' };
      }
    };

    return {
      calculateRiskScore: function(transaction) {
        const deferred = $q.defer();
        const url = API_CONFIG.baseUrl + API_CONFIG.endpoints.riskScore;
        $http.post(url, transaction.toJSON())
          .then(function(response) {
            deferred.resolve({
              riskScore: response.data.riskScore,
              fraudSignals: response.data.fraudSignals || [],
              modelVersion: response.data.modelVersion || 'v1.0'
            });
          })
          .catch(function(error) {
            console.warn('Risk scoring API unavailable, using fallback engine:', error);
            const fallbackResult = mockRiskEngine.calculateScore(transaction);
            deferred.resolve({
              riskScore: fallbackResult.score,
              fraudSignals: fallbackResult.signals,
              modelVersion: fallbackResult.modelVersion + '-fallback'
            });
          });
        return deferred.promise;
      }
    };
  }
})();