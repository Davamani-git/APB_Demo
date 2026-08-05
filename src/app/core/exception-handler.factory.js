(function () {
  'use strict';

  angular
    .module('timerApp')
    .factory('$exceptionHandler', exceptionHandler);

  exceptionHandler.$inject = ['AuditLoggerService'];

  function exceptionHandler(AuditLoggerService) {
    return function (exception, cause) {
      try {
        AuditLoggerService.logError('Global', exception || { message: 'Unknown error', cause: cause });
      } catch (e) {
      }
    };
  }
})();
