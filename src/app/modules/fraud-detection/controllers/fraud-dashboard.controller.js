(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .controller('FraudDashboardController', ['TransactionIngestionService', 'DecisionEngineService', 'AlertService', function(TransactionIngestionService, DecisionEngineService, AlertService) {
      var vm = this;
      vm.processedTransactions = [];
      vm.alerts = [];
      vm.loading = false;
      vm.error = null;
      vm.init = function() {
        vm.loading = true;
        TransactionIngestionService.fetchRecentTransactions().then(function(transactions) {
          var promises = transactions.map(function(txn) {
            return TransactionIngestionService.processTransaction(txn).then(function(riskResult) {
              return DecisionEngineService.applyDecisionRules(riskResult);
            });
          });
          return Promise.all(promises);
        }).then(function(results) {
          vm.processedTransactions = results;
          return AlertService.getAlerts();
        }).then(function(alerts) {
          vm.alerts = alerts;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
          console.error(error);
        });
      };
      vm.refresh = function() {
        vm.init();
      };
      vm.init();
    }]);
})();