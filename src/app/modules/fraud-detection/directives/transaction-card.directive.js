(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .directive('transactionCard', ['riskLevelFilter', function(riskLevelFilter) {
      return {
        restrict: 'E',
        scope: {
          transaction: '='
        },
        templateUrl: 'src/app/modules/fraud-detection/views/transaction-card.html',
        link: function(scope) {
          scope.getRiskClass = function() {
            if (!scope.transaction.riskLevel) return '';
            return 'risk-' + scope.transaction.riskLevel.toLowerCase();
          };
          scope.getRiskBadgeClass = function() {
            if (!scope.transaction.riskLevel) return '';
            return 'badge-' + scope.transaction.riskLevel.toLowerCase();
          };
          scope.formatRiskLevel = function() {
            return riskLevelFilter(scope.transaction.riskScore);
          };
        }
      };
    }]);
})();