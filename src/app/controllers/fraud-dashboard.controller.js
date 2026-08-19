(function() {
  'use strict';
  angular.module('fraudAlert.dashboard')
    .controller('FraudDashboardController', ['$scope', 'TransactionIngestionService', 'FraudRiskService', 'PolicyDecisionService', 'AlertNotificationService', 'AuditTrailService', function($scope, TransactionIngestionService, FraudRiskService, PolicyDecisionService, AlertNotificationService, AuditTrailService) {
      var vm = this;
      vm.alerts = [];
      vm.metrics = {
        totalTransactions: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        alertsSent: 0
      };
      vm.loading = true;
      vm.error = null;

      vm.init = function() {
        TransactionIngestionService.subscribe(vm.handleTransactionEvent);
        vm.loading = false;
      };

      vm.handleTransactionEvent = function(transactionEvent) {
        vm.metrics.totalTransactions++;
        
        FraudRiskService.evaluateRisk(transactionEvent)
          .then(function(riskAssessment) {
            return PolicyDecisionService.determineAction(riskAssessment)
              .then(function(policyDecision) {
                vm.updateMetrics(riskAssessment);
                vm.addAlert(transactionEvent, riskAssessment, policyDecision);

                if (policyDecision.action === 'send_alert' || policyDecision.action === 'escalate') {
                  return AlertNotificationService.sendAlert(
                    transactionEvent.transactionId,
                    riskAssessment.riskLevel,
                    riskAssessment
                  ).then(function() {
                    vm.metrics.alertsSent++;
                    return AuditTrailService.logDecision(policyDecision, riskAssessment);
                  });
                } else {
                  return AuditTrailService.logDecision(policyDecision, riskAssessment);
                }
              });
          })
          .catch(function(error) {
            vm.error = 'Error processing transaction: ' + (error.message || error);
            console.error('Error processing transaction:', error);
          })
          .finally(function() {
            $scope.$apply();
          });
      };

      vm.updateMetrics = function(riskAssessment) {
        switch(riskAssessment.riskLevel) {
          case 'high':
          case 'confirmed_fraud':
            vm.metrics.highRiskCount++;
            break;
          case 'medium':
            vm.metrics.mediumRiskCount++;
            break;
          case 'low':
            vm.metrics.lowRiskCount++;
            break;
        }
      };

      vm.addAlert = function(transactionEvent, riskAssessment, policyDecision) {
        var alert = {
          transactionId: transactionEvent.transactionId,
          cardNumber: transactionEvent.cardNumber,
          amount: transactionEvent.amount,
          currency: transactionEvent.currency,
          merchantName: transactionEvent.merchantName,
          riskScore: riskAssessment.riskScore,
          riskLevel: riskAssessment.riskLevel,
          action: policyDecision.action,
          signals: riskAssessment.signals,
          timestamp: transactionEvent.transactionTimestamp
        };
        vm.alerts.unshift(alert);
        if (vm.alerts.length > 50) {
          vm.alerts.pop();
        }
      };

      vm.getSignalsList = function(signals) {
        var list = [];
        if (signals.unusualAmount) list.push('Unusual Amount');
        if (signals.suspiciousMerchant) list.push('Suspicious Merchant');
        if (signals.geographicAnomaly) list.push('Geographic Anomaly');
        if (signals.velocityViolation) list.push('Velocity Violation');
        if (signals.authorizationFailure) list.push('Authorization Failure');
        if (signals.compromisedCard) list.push('Compromised Card');
        return list.join(', ') || 'None';
      };

      $scope.$on('$destroy', function() {
        TransactionIngestionService.unsubscribe(vm.handleTransactionEvent);
      });

      vm.init();
    }]);
})();