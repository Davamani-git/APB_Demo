angular.module('fraudDetectionModule').factory('PolicyModel', [function() {
  class Policy {
    constructor(data) {
      if (!data || !data.policyId) {
        throw new Error('Invalid policy data');
      }
      this.policyId = data.policyId;
      this.riskThresholds = data.riskThresholds || {
        low: 0.3,
        medium: 0.65,
        high: 0.85,
        confirmedFraud: 0.95
      };
      this.decisionRules = data.decisionRules || [];
      this.failSafeBehavior = data.failSafeBehavior || 'fail-safe';
      this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
    }
    getRiskBand(score) {
      if (score >= this.riskThresholds.confirmedFraud) return 'confirmed-fraud';
      if (score >= this.riskThresholds.high) return 'high';
      if (score >= this.riskThresholds.medium) return 'medium';
      return 'low';
    }
    getDecisionForRiskBand(riskBand) {
      const rule = this.decisionRules.find(r => r.riskBand === riskBand);
      return rule ? rule.action : 'approve';
    }
  }
  return Policy;
}]);