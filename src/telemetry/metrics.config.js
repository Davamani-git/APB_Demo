(function() {
  'use strict';

  function TelemetryMetricsConfig($provide) {
    $provide.decorator('$rootScope', function($delegate) {
      var startTime;
      
      $delegate.$on('$routeChangeStart', function() {
        startTime = Date.now();
      });
      
      $delegate.$on('$routeChangeSuccess', function() {
        if (startTime) {
          var loadTime = Date.now() - startTime;
          console.log('Route load time:', loadTime + 'ms');
        }
      });
      
      return $delegate;
    });
  }

  TelemetryMetricsConfig.$inject = ['$provide'];

  angular.module('davms.app')
    .config(TelemetryMetricsConfig);
})();