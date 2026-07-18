(function() {
  'use strict';

  TelemetryMetricsConfig.$inject = ['$rootScope', '$window'];

  function TelemetryMetricsConfig($rootScope, $window) {
    var performance = $window.performance;
    if (!performance || !performance.now) {
      return;
    }

    var navigationStart = performance.timing ? performance.timing.navigationStart : null;

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
      if (!navigationStart) {
        return;
      }
      var loadTimeMs = performance.now();
      // Metric values can be sent via LoggingService from run block; here we only compute.
      // No side-effects beyond potential console logging for metrics.
      /* eslint-disable no-console */
      console.log('Route loaded in ms:', loadTimeMs);
      /* eslint-enable no-console */
    });
  }

  angular.module('davms.app').config(TelemetryMetricsConfig);
})();
