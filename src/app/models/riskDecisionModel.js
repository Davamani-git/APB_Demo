angular.module('fraudDetectionApp').factory('riskDecisionModel', [function() {
  function RiskDecision(data) {
    this.transactionId = data.transactionId || '';
    this.riskScore = data.riskScore || 0;
    this.riskLevel = data.riskLevel || 'low';
    this.riskSignals = data.riskSignals || {
      amountAnomaly: false,
      geographicInconsistency: false,
      merchantReputation: 'unknown',
      velocityPattern: 'normal',
      deviceRisk: 'low'
    };
    this.alertTriggered = data.alertTriggered || false;
    this.timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    this.decisionReason = data.decisionReason || '';
  }
  
  RiskDecision.prototype.getRiskLevelDescription = function() {
    const descriptions = {
      low: 'Low Risk - Transaction approved',
      medium: 'Medium Risk - Monitoring required',
      high: 'High Risk - Alert triggered',
      confirmed_fraud: 'Confirmed Fraud - Account protection initiated'
    };
    return descriptions[this.riskLevel] || 'Unknown risk level';
  };
  
  RiskDecision.prototype.getActiveSignals = function() {
    const signals = [];
    if (this.riskSignals.amountAnomaly) signals.push('Unusual transaction amount');
    if (this.riskSignals.geographicInconsistency) signals.push('Geographic inconsistency detected');
    if (this.riskSignals.merchantReputation === 'poor' || this.riskSignals.merchantReputation === 'suspicious') {
      signals.push('Merchant reputation concern');
    }
    if (this.riskSignals.velocityPattern === 'high' || this.riskSignals.velocityPattern === 'suspicious') {
      signals.push('Unusual velocity pattern');
    }
    if (this.riskSignals.deviceRisk === 'high' || this.riskSignals.deviceRisk === 'suspicious') {
      signals.push('Device risk detected');
    }
    return signals;
  };
  
  return RiskDecision;
}]);