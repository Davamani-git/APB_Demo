(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .controller('TransactionMonitorController', ['$interval', 'TransactionIngestionService', 'FraudRiskFactory', function($interval, TransactionIngestionService, FraudRiskFactory) {
      var vm = this;
      vm.transactions = [];
      vm.loading = false;
      vm.autoRefresh = true;
      vm.init = function() {
        vm.loadTransactions();
        if (vm.autoRefresh) {
          vm.intervalPromise = $interval(vm.loadTransactions, 10000);
        }
      };
      vm.loadTransactions = function() {
        vm.loading = true;
        TransactionIngestionService.fetchRecentTransactions().then(function(transactions) {
          var promises = transactions.map(function(txn) {
            return FraudRiskFactory.evaluateRisk(txn).then(function(riskResult) {
              txn.riskScore = riskResult.riskScore;
              txn.riskLevel = riskResult.riskLevel;
              txn.decision = riskResult.decision;
              return txn;
            }).catch(function() {
              txn.riskScore = null;
              txn.riskLevel = 'UNKNOWN';
              return txn;
            });
          });
          return Promise.all(promises);
        }).then(function(enrichedTransactions) {
          vm.transactions = enrichedTransactions;
          vm.loading = false;
        }).catch(function(error) {
          console.error('Failed to load transactions:', error);
          vm.loading = false;
        });
      };
      vm.toggleAutoRefresh = function() {
        vm.autoRefresh = !vm.autoRefresh;
        if (vm.autoRefresh) {
          vm.intervalPromise = $interval(vm.loadTransactions, 10000);
        } else if (vm.intervalPromise) {
          $interval.cancel(vm.intervalPromise);
        }
      };
      vm.$onDestroy = function() {
        if (vm.intervalPromise) {
          $interval.cancel(vm.intervalPromise);
        }
      };
      vm.init();
    }]);
})();