(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .service('policyDecisionService', ['fraudRiskFactory', 'configService', 'alertRecordService', 'auditService', '$q', function(fraudRiskFactory, configService, alertRecordService, auditService, $q) {
      const self = this;
      
      self.processTransaction = function(transaction) {
        return fraudRiskFactory.evaluateRisk(transaction)
          .then(function(riskScore) {
            return configService.getThresholds().then(function(thresholds) {
              const decision = self.applyPolicy(riskScore, thresholds);
              decision.transactionId = transaction.transactionId;
              decision.riskScore = riskScore.score;
              decision.riskLevel = riskScore.level;
              return self.executeDecision(decision, transaction, riskScore);
            });
          });
      };
      
      self.applyPolicy = function(riskScore, thresholds) {
        let treatment = 'approve';
        let reason = 'Transaction approved';
        
        if (riskScore.level === 'confirmed_fraud' || riskScore.score >= thresholds.high) {
          treatment = 'decline';
          reason = 'High risk transaction declined';
        } else if (riskScore.score >= thresholds.medium) {
          treatment = 'alert';
          reason = 'Medium risk transaction requires review';
        } else if (riskScore.score >= thresholds.low) {
          treatment = 'alert';
          reason = 'Low-medium risk transaction flagged for monitoring';
        }
        
        return {
          treatment: treatment,
          reason: reason,
          timestamp: new Date()
        };
      };
      
      self.executeDecision = function(decision, transaction, riskScore) {
        const auditData = {
          transactionId: transaction.transactionId,
          eventType: 'policy_applied',
          payload: {
            decision: decision,
            riskScore: riskScore
          }
        };
        
        if (decision.treatment === 'alert' || decision.treatment === 'step_up' || decision.treatment === 'hold' || decision.treatment === 'decline') {
          return alertRecordService.createAlert({
            transactionId: transaction.transactionId,
            cardId: transaction.cardId,
            riskScore: riskScore.score,
            riskLevel: riskScore.level,
            treatment: decision.treatment
          }).then(function(alert) {
            auditData.eventType = 'alert_created';
            auditData.payload.alertId = alert.alertId;
            return auditService.logDecision(auditData).then(function() {
              return { decision: decision, alert: alert };
            });
          });
        } else {
          return auditService.logDecision(auditData).then(function() {
            return { decision: decision, alert: null };
          });
        }
      };
    }]);
})();