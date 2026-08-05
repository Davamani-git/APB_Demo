(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['APP_CONFIG', '$log'];
  function LoggingService(APP_CONFIG, $log) {
    var service = this;

    service.newCorrelationId = function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    service.info = function (msg, data) {
      if (APP_CONFIG.LOG_LEVEL === 'INFO') {
        $log.info(msg, data);
      }
    };

    service.warn = function (msg, data) {
      $log.warn(msg, data);
    };

    service.error = function (msg, data) {
      $log.error(msg, data);
    };
  }
})();
