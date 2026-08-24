angular.module('fraudDetection').service('PolicyDecisionService', ['$q', function($q) {
  var thresholds = {
    low: 30,
    medium: 60,
    high: 85,
    confirmedFraud: 95
  };
  
  this.setThresholds = function(newThresholds) {
    angular.extend(thresholds, newThresholds);
  };
  
  this.evaluateRiskScore = function(riskScore) {
    if (!riskScore || typeof riskScore.overallScore !== 'number') {
      return $q.reject({error: 'Invalid risk score for policy evaluation'});
    }
    var score = riskScore.overallScore;
    var decision = {
      transactionId: riskScore.transactionId,
      riskScore: score,
      riskLevel: riskScore.riskLevel,
      action: 'approve',
      requiresAlert: false,
      requiresBlock: false,
      evaluatedAt: new Date()
    };
    if (score >= thresholds.confirmedFraud) {
      decision.riskLevel = 'confirmed_fraud';
      decision.action = 'block';
      decision.requiresAlert = true;
      decision.requiresBlock = true;
    } else if (score >= thresholds.high) {
      decision.riskLevel = 'high';
      decision.action = 'hold';
      decision.requiresAlert = true;
      decision.requiresBlock = false;
    } else if (score >= thresholds.medium) {
      decision.riskLevel = 'medium';
      decision.action = 'approve_with_monitoring';
      decision.requiresAlert = true;
      decision.requiresBlock = false;
    } else {
      decision.riskLevel = 'low';
      decision.action = 'approve';
      decision.requiresAlert = false;
      decision.requiresBlock = false;
    }
    return $q.resolve(decision);
  };
  
  this.determineAction = function(riskLevel) {
    var actions = {
      low: 'approve',
      medium: 'approve_with_monitoring',
      high: 'hold',
      confirmed_fraud: 'block'
    };
    return actions[riskLevel] || 'approve';
  };
}]);