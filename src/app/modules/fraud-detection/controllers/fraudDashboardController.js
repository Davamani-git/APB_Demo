angular.module('fraudDetectionApp').controller('fraudDashboardController', ['$scope', 'transactionIngestionService', 'policyDecisionService', function($scope, transactionIngestionService, policyDecisionService) {
  const ctrl = this;
  ctrl.transactions = [];
  ctrl.loading = true;
  ctrl.error = null;
  
  ctrl.init = function() {
    ctrl.loadTransactions();
  };
  
  ctrl.loadTransactions = function() {
    ctrl.loading = true;
    ctrl.error = null;
    
    transactionIngestionService.fetchTransactions()
      .then(transactions => {
        ctrl.transactions = [];
        const evaluationPromises = transactions.map(tx => {
          return policyDecisionService.evaluateRisk(tx)
            .then(riskDecision => {
              return {
                transaction: tx,
                riskDecision: riskDecision
              };
            });
        });
        
        return Promise.all(evaluationPromises);
      })
      .then(results => {
        ctrl.transactions = results;
        ctrl.loading = false;
        $scope.$apply();
      })
      .catch(error => {
        ctrl.error = 'Failed to load transactions: ' + (error.message || 'Unknown error');
        ctrl.loading = false;
        $scope.$apply();
      });
  };
  
  ctrl.init();
}]);