(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .directive('ccdSummaryTiles', ccdSummaryTiles);

  function ccdSummaryTiles() {
    return {
      restrict: 'E',
      scope: {
        summary: '='
      },
      templateUrl: 'src/app/dashboard/views/partials/summary-tiles.html'
    };
  }
})();
