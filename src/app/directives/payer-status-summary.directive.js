(function() {
  'use strict';
  angular.module('providerEnrollmentApp').directive('payerStatusSummary', [payerStatusSummary]);
  function payerStatusSummary() {
    return {
      restrict: 'E',
      scope: { payerStatuses: '=', onSelect: '&' },
      templateUrl: 'src/app/directives/payer-status-summary.template.html',
      controller: ['$scope', function($scope) {
        $scope.selectPayer = function(payer) {
          $scope.onSelect({ payer: payer });
        };
      }]
    };
  }
})();