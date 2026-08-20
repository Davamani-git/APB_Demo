(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('riskDecisionModel', [riskDecisionModel]);

  function riskDecisionModel() {
    function RiskDecision(data) {
      this.transactionId = data.transactionId || '';
      this.riskScore = data.riskScore || 0;
      this.riskBand = data.riskBand || 'low';
      this.fraudSignals = data.fraudSignals || [];
      this.modelVersion = data.modelVersion || 'v1.0';
      this.decisionTimestamp = data.decisionTimestamp ? new Date(data.decisionTimestamp) : new Date();
      this.policyThresholds = data.policyThresholds || { low: 30, medium: 60, high: 85 };
      this.action = data.action || 'allow';
      this.merchantName = data.merchantName || '';
      this.merchantCategory = data.merchantCategory || '';
      this.amount = data.amount || 0;
      this.currency = data.currency || 'USD';
      this.location = data.location || { country: '' };
    }

    RiskDecision.prototype.isHighRisk = function() {
      return this.riskBand === 'high' || this.riskBand === 'confirmed_fraud';
    };

    RiskDecision.prototype.requiresAlert = function() {
      return this.riskBand === 'medium' || this.isHighRisk();
    };

    RiskDecision.prototype.toJSON = function() {
      return {
        transactionId: this.transactionId,
        riskScore: this.riskScore,
        riskBand: this.riskBand,
        fraudSignals: this.fraudSignals,
        modelVersion: this.modelVersion,
        decisionTimestamp: this.decisionTimestamp.toISOString(),
        policyThresholds: this.policyThresholds,
        action: this.action
      };
    };

    return {
      create: function(data) {
        return new RiskDecision(data);
      }
    };
  }
})();