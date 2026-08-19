angular.module('fraudDetectionApp').directive('transactionMonitor', ['TransactionIngestionService', 'FraudRiskService', '$interval', function(TransactionIngestionService, FraudRiskService, $interval) {
  return {
    restrict: 'E',
    templateUrl: 'src/app/fraud-detection/views/transaction-monitor.directive.html',
    scope: {},
    link: function(scope) {
      scope.transactions = [];
      scope.loading = false;
      scope.error = null;

      scope.loadTransactions = function() {
        scope.loading = true;
        TransactionIngestionService.getRecentTransactions(20).then(function(transactions) {
          scope.transactions = transactions;
          scope.loading = false;
        }).catch(function(error) {
          scope.error = 'Failed to load transactions';
          scope.loading = false;
        });
      };

      scope.getRiskLevel = function(transaction) {
        if (!transaction.riskScore) return 'unknown';
        if (transaction.riskScore < 30) return 'low';
        if (transaction.riskScore < 60) return 'medium';
        if (transaction.riskScore < 80) return 'high';
        return 'critical';
      };

      scope.loadTransactions();
      var refreshInterval = $interval(function() {
        scope.loadTransactions();
      }, 15000);

      scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }
  };
}]);