(function() {
  'use strict';

  TelemetryMetricsConfig.$inject = ['$provide'];

  function TelemetryMetricsConfig($provide) {
    $provide.decorator('$rootScope', ['$delegate', function($delegate) {
      var routeStartTime;

      $delegate.$on('$routeChangeStart', function() {
        routeStartTime = new Date().getTime();
      });

      $delegate.$on('$routeChangeSuccess', function(event, current) {
        if (routeStartTime) {
          var loadTime = new Date().getTime() - routeStartTime;
          console.log('Route load time:', loadTime + 'ms', 'Route:', current.$$route.originalPath);
        }
      });

      return $delegate;
    }]);
  }

  angular.module('davms.app').config(TelemetryMetricsConfig);
})();