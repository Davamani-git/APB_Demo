(function() {
  'use strict';

  TelemetryMetricsConfig.$inject = ['$rootScope', '$window'];

  function TelemetryMetricsConfig($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function() {
      if ($window && $window.performance && $window.performance.now) {
        // Example metric capture for route load timing
        var timing = $window.performance.now();
        // In a real implementation this could be sent to a metrics endpoint.
      }
    });
  }

  angular.module('davms.app')
    .config(TelemetryMetricsConfig);
})();
