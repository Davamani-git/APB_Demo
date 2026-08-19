angular.module('fraudDetectionApp').service('PolicyDecisionService', ['$q', 'FraudRiskService', 'ThresholdConfigFactory', function($q, FraudRiskService, ThresholdConfigFactory) {
  var self = this;

  this.makeDecision = function(riskScoreData) {
    if (!riskScoreData || typeof riskScoreData.riskScore === 'undefined') {
      return $q.reject({ error: 'Invalid risk score data' });
    }
    return ThresholdConfigFactory.getThresholds().then(function(thresholds) {
      var activeThresholds = thresholds.filter(function(t) { return t.enabled; });
      var matchedThreshold = self.findMatchingThreshold(riskScoreData.riskScore, activeThresholds);
      if (!matchedThreshold) {
        return {
          transactionId: riskScoreData.transactionId,
          riskScore: riskScoreData.riskScore,
          action: 'approve',
          threshold: 'low',
          timestamp: new Date(),
          reason: 'Risk score below alert threshold'
        };
      }
      return {
        transactionId: riskScoreData.transactionId,
        riskScore: riskScoreData.riskScore,
        action: matchedThreshold.action,
        threshold: matchedThreshold.level,
        timestamp: new Date(),
        reason: 'Risk score matched ' + matchedThreshold.level + ' threshold'
      };
    });
  };

  this.findMatchingThreshold = function(riskScore, thresholds) {
    var sorted = thresholds.sort(function(a, b) { return b.minScore - a.minScore; });
    for (var i = 0; i < sorted.length; i++) {
      var threshold = sorted[i];
      if (riskScore >= threshold.minScore && riskScore <= threshold.maxScore) {
        return threshold;
      }
    }
    return null;
  };

  this.evaluateTransaction = function(transactionEvent) {
    return FraudRiskService.calculateRiskScore(transactionEvent).then(function(riskScoreData) {
      return self.makeDecision(riskScoreData);
    });
  };
}]);