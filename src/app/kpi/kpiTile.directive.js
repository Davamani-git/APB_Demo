(function() {
  'use strict';
  angular
    .module('execDashboard.kpi')
    .directive('kpiTile', kpiTile);

  function kpiTile() {
    return {
      restrict: 'E',
      scope: {
        kpi: '=',
        editable: '='
      },
      templateUrl: 'src/app/kpi/views/kpi-tile.html'
    };
  }
})();
