(function() {
  'use strict';

  TelemetryLoggingConfig.$inject = ['$provide'];

  function TelemetryLoggingConfig($provide) {
    $provide.decorator('$log', ['$delegate', function($delegate) {
      var originalInfo = $delegate.info;
      var originalWarn = $delegate.warn;
      var originalError = $delegate.error;

      $delegate.info = function() {
        originalInfo.apply(null, arguments);
      };

      $delegate.warn = function() {
        originalWarn.apply(null, arguments);
      };

      $delegate.error = function() {
        originalError.apply(null, arguments);
      };

      return $delegate;
    }]);
  }

  angular.module('davms.app').config(TelemetryLoggingConfig);
})();