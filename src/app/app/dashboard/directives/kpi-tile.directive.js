(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .directive('kpiTile', [function () {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          unit: '@',
          description: '@'
        },
        templateUrl: 'src/app/app/dashboard/directives/kpi-tile.html'
      };
    }]);
})();
