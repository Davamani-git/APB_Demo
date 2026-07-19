(function () {
  'use strict';

  ExceptionHandlerService.$inject = ['loggingService'];

  function ExceptionHandlerService(loggingService) {
    function handleException(exception, cause) {
      loggingService.error('Unhandled exception', {
        exception: exception && (exception.stack || exception.message || exception.toString()),
        cause: cause
      });
    }

    return {
      handleException: handleException
    };
  }

  angular.module('app')
    .service('exceptionHandlerService', ExceptionHandlerService);
})();
