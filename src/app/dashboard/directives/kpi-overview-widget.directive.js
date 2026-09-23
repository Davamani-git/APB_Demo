(function() {
  'use strict';
  angular.module('creditDashboardApp').directive('kpiOverviewWidget', [function() {
    return {
      restrict: 'E',
      scope: {
        kpiData: '='
      },
      templateUrl: 'src/app/dashboard/directives/kpi-overview-widget.html'
    };
  }]);
})();