(function() {
  'use strict';
  angular.module('creditDashboardApp').directive('cardSummaryPanel', [function() {
    return {
      restrict: 'E',
      scope: {
        cardData: '='
      },
      templateUrl: 'src/app/dashboard/directives/card-summary-panel.html'
    };
  }]);
})();