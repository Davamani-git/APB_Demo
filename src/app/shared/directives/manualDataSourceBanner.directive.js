(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .directive('manualDataSourceBanner', manualDataSourceBanner);

  function manualDataSourceBanner() {
    return {
      restrict: 'E',
      scope: {
        sourceNote: '='
      },
      templateUrl: 'src/app/shared/directives/views/manual-data-source-banner.html'
    };
  }
})();
