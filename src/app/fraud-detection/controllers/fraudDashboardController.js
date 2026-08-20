(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .controller('fraudDashboardController', ['$scope', '$interval', 'transactionIngestionService', 'policyDecisionService', fraudDashboardController]);

  function fraudDashboardController($scope, $interval, transactionIngestionService, policyDecisionService) {
    const vm = this;
    vm.riskDecisions = [];
    vm.metrics = {
      totalTransactions: 0,
      lowRisk: 0,
      mediumRisk: 0,
      highRisk: 0
    };
    vm.loading = true;
    vm.error = null;

    vm.init = function() {
      vm.loadTransactions();
      $interval(function() {
        vm.loadTransactions();
      }, 30000);
    };

    vm.loadTransactions = function() {
      vm.loading = true;
      vm.error = null;
      transactionIngestionService.fetchTransactionEvents()
        .then(function(transactions) {
          return transactionIngestionService.processTransactionBatch(transactions);
        })
        .then(function(processedResults) {
          const validResults = processedResults.filter(function(r) { return !r.error; });
          const policyPromises = validResults.map(function(result) {
            return policyDecisionService.applyPolicyThresholds(result);
          });
          return Promise.all(policyPromises);
        })
        .then(function(decisions) {
          vm.riskDecisions = decisions.sort(function(a, b) {
            return b.decisionTimestamp - a.decisionTimestamp;
          });
          vm.updateMetrics();
          vm.loading = false;
          $scope.$apply();
        })
        .catch(function(error) {
          console.error('Error loading transactions:', error);
          vm.error = 'Failed to load transaction data. Please try again later.';
          vm.loading = false;
          $scope.$apply();
        });
    };

    vm.updateMetrics = function() {
      vm.metrics.totalTransactions = vm.riskDecisions.length;
      vm.metrics.lowRisk = vm.riskDecisions.filter(function(d) { return d.riskBand === 'low'; }).length;
      vm.metrics.mediumRisk = vm.riskDecisions.filter(function(d) { return d.riskBand === 'medium'; }).length;
      vm.metrics.highRisk = vm.riskDecisions.filter(function(d) { return d.riskBand === 'high' || d.riskBand === 'confirmed_fraud'; }).length;
    };

    vm.init();
  }
})();