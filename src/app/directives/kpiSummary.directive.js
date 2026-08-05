(function () {
  'use strict';

  angular
    .module('execSummary.directives')
    .directive('kpiSummary', [function () {
      return {
        restrict: 'E',
        scope: {
          kpiData: '='
        },
        templateUrl: 'src/app/views/kpi-summary.html'
      };
    }]);
})();