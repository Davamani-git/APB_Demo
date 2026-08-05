(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .directive('creditSummaryTile', [function(){
      return {
        restrict: 'E',
        scope: {
          summary: '='
        },
        templateUrl: 'src/app/assets/js/app/dashboard/templates/partials/credit-summary-tile.html'
      };
    }]);
})();
