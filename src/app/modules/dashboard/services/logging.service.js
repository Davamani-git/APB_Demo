(function() {
  'use strict';

  LoggingService.$inject = ['$log'];

  function LoggingService($log) {
    this.info = function(message, context) {
      $log.info(message, context || {});
    };

    this.warn = function(message, context) {
      $log.warn(message, context || {});
    };

    this.error = function(message, context) {
      $log.error(message, context || {});
    };
  }

  angular.module('app')
    .service('LoggingService', LoggingService);
})();
