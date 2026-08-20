(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .controller('fraudDashboardController', ['$scope', '$interval', 'transactionIngestionService', 'fraudRiskService', 'policyDecisionService', 'alertNotificationService', 'auditTrailService', 'configService', function($scope, $interval, transactionIngestionService, fraudRiskService, policyDecisionService, alertNotificationService, auditTrailService, configService) {
      const vm = this;
      vm.transactions = [];
      vm.loading = false;
      vm.error = null;
      vm.thresholds = null;
      vm.stats = {
        total: 0,
        low: 0,
        medium: 0,
        high: 0,
        alertsTriggered: 0
      };
      vm.init = function() {
        vm.loading = true;
        configService.getThresholds().then(function(thresholds) {
          vm.thresholds = thresholds;
          return vm.loadTransactions();
        }).catch(function(error) {
          vm.error = error.message || 'Failed to initialize dashboard';
        }).finally(function() {
          vm.loading = false;
        });
      };
      vm.loadTransactions = function() {
        return transactionIngestionService.fetchTransactions().then(function(transactions) {
          vm.transactions = [];
          vm.stats = {total: 0, low: 0, medium: 0, high: 0, alertsTriggered: 0};
          const promises = transactions.map(function(txn) {
            return vm.processTransaction(txn);
          });
          return Promise.all(promises);
        }).catch(function(error) {
          vm.error = error.message || 'Failed to load transactions';
        });
      };
      vm.processTransaction = function(transaction) {
        return fraudRiskService.evaluateRisk(transaction).then(function(riskAssessment) {
          return policyDecisionService.applyPolicy(riskAssessment.riskScore, transaction.transactionId).then(function(decision) {
            const enrichedTransaction = angular.extend({}, transaction, {
              riskScore: riskAssessment.riskScore,
              riskBand: decision.riskBand,
              riskSignals: riskAssessment.riskSignals,
              alertTriggered: decision.alertTriggered,
              evaluationTimestamp: riskAssessment.evaluationTimestamp
            });
            vm.transactions.push(enrichedTransaction);
            vm.updateStats(enrichedTransaction);
            if (decision.alertTriggered) {
              return alertNotificationService.sendAlert(transaction, decision.riskBand, riskAssessment).then(function() {
                return auditTrailService.logDecision(transaction, decision, riskAssessment);
              });
            } else {
              return auditTrailService.logDecision(transaction, decision, riskAssessment);
            }
          });
        }).catch(function(error) {
          console.error('Error processing transaction:', error);
        });
      };
      vm.updateStats = function(transaction) {
        vm.stats.total++;
        if (transaction.riskBand === 'low') {
          vm.stats.low++;
        } else if (transaction.riskBand === 'medium') {
          vm.stats.medium++;
        } else if (transaction.riskBand === 'high' || transaction.riskBand === 'critical') {
          vm.stats.high++;
        }
        if (transaction.alertTriggered) {
          vm.stats.alertsTriggered++;
        }
      };
      vm.refresh = function() {
        vm.loadTransactions();
      };
      vm.getRiskClass = function(riskBand) {
        const classes = {
          low: 'risk-low',
          medium: 'risk-medium',
          high: 'risk-high',
          critical: 'risk-high'
        };
        return classes[riskBand] || '';
      };
      vm.init();
      const autoRefresh = $interval(function() {
        vm.refresh();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (autoRefresh) {
          $interval.cancel(autoRefresh);
        }
      });
    }]);
})();