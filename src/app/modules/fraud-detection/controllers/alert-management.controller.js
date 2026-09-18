(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .controller('AlertManagementController', ['$scope', 'TransactionIngestionService', 'PolicyDecisionService', 'AlertCreationService', function($scope, TransactionIngestionService, PolicyDecisionService, AlertCreationService) {
      const vm = this;
      
      vm.transaction = {};
      vm.ingestionStatus = '';
      
      vm.ingestTransaction = function() {
        vm.ingestionStatus = 'Processing...';
        
        TransactionIngestionService.ingestTransaction(vm.transaction)
          .then(function(result) {
            const decision = PolicyDecisionService.evaluateRisk(result.risk);
            
            if (decision.action === 'alert') {
              return AlertCreationService.createAlert(result.transaction, result.risk)
                .then(function(alert) {
                  vm.ingestionStatus = 'Alert created: ' + alert.alert_id;
                  $scope.$broadcast('alert-created', alert);
                  vm.transaction = {};
                });
            } else {
              vm.ingestionStatus = 'Transaction processed. Action: ' + decision.action;
              vm.transaction = {};
            }
          })
          .catch(function(error) {
            vm.ingestionStatus = 'Error: ' + (error.error || 'Unknown error');
          });
      };
    }]);
})();