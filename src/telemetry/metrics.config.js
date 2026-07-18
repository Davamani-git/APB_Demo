(function () {
  'use strict';

  TelemetryMetricsConfig.$inject = ['$rootScope', 'LoggingService'];

  function TelemetryMetricsConfig($rootScope, LoggingService) {
    var routeStartTime = null;

    $rootScope.$on('$routeChangeStart', function () {
      routeStartTime = new Date().getTime();
    });

    $rootScope.$on('$routeChangeSuccess', function (event, current) {
      if (routeStartTime) {
        var duration = new Date().getTime() - routeStartTime;
        LoggingService.info('Route load metrics', {
          route: current && current.originalPath,
          durationMs: duration
        });
        routeStartTime = null;
      }
    });
  }

  angular.module('davms.app').config(TelemetryMetricsConfig);
})();
