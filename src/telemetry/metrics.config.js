(function() {
  'use strict';

  TelemetryMetricsConfig.$inject = ['$rootScope', 'LoggingService'];

  function TelemetryMetricsConfig($rootScope, LoggingService) {
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
      var path = current && current.originalPath ? current.originalPath : 'unknown';
      LoggingService.info('Route load metric', { path: path, timestamp: new Date().toISOString() });
    });
  }

  angular.module('davms.app')
    .config(TelemetryMetricsConfig);
})();
