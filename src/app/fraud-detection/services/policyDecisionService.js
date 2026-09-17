angular.module('fraudDetectionModule').service('policyDecisionService', ['$q', 'configService', 'alertCandidateService', 'analyticsService', function($q, configService, alertCandidateService, analyticsService) {
  this.evaluateTransaction = function(transaction, riskResult) {
    return configService.getPolicyConfiguration().then(function(policy) {
      const riskBand = policy.getRiskBand(riskResult.score);
      const action = policy.getDecisionForRiskBand(riskBand);
      const decision = {
        action: action,
        riskBand: riskBand,
        riskScore: riskResult.score,
        transactionId: transaction.transactionId
      };
      if (action === 'alert' || action === 'hold' || action === 'decline') {
        return alertCandidateService.createAlert({
          transactionId: transaction.transactionId,
          cardId: transaction.cardId,
          riskScore: riskResult.score,
          riskBand: riskBand,
          decision: action
        }).then(function(alert) {
          analyticsService.emitEvent('alert_created', {
            alertId: alert.alertId,
            riskBand: riskBand,
            action: action
          });
          return decision;
        });
      }
      analyticsService.emitEvent('transaction_approved', {
        transactionId: transaction.transactionId,
        riskScore: riskResult.score
      });
      return decision;
    }).catch(function(error) {
      console.error('Policy evaluation failed:', error);
      return configService.getFailSafeBehavior().then(function(behavior) {
        if (behavior === 'fail-open') {
          return { action: 'approve', riskBand: 'unknown', riskScore: 0, transactionId: transaction.transactionId };
        }
        return { action: 'hold', riskBand: 'unknown', riskScore: 0, transactionId: transaction.transactionId };
      });
    });
  };
}]);