(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$injector'];

  function LoggingService($log, $injector) {
    var httpInstance = null;

    var service = {
      info: info,
      warn: warn,
      error: error
    };
    return service;

    function getHttp() {
      if (!httpInstance) {
        httpInstance = $injector.get('$http');
      }
      return httpInstance;
    }

    function info(message, context) {
      $log.info(message, context || {});
      // Remote logging can be added via getHttp() if needed.
    }

    function warn(message, context) {
      $log.warn(message, context || {});
    }

    function error(message, context) {
      $log.error(message, context || {});
    }
  }

  angular.module('davmsApp')
    .service('LoggingService', LoggingService);
})();
