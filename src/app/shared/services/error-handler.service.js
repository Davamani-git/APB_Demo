'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .service('ErrorHandlerService', ErrorHandlerService);

  ErrorHandlerService.$inject = ['LoggingService'];

  function ErrorHandlerService(LoggingService) {
    var service = {
      handle: handle,
      getUserMessage: getUserMessage
    };

    return service;

    function handle(error, context) {
      var clientError = {
        code: (error && error.code) || 'UNKNOWN',
        message: getUserMessage((error && error.code) || null),
        httpStatus: (error && error.status) || 0,
        details: error || {}
      };
      LoggingService.error('Handled error', { context: context, error: error });
      return clientError;
    }

    function getUserMessage(errorCode) {
      switch (errorCode) {
        case 'NETWORK':
          return 'A network error occurred. Please check your connection and try again.';
        case 'AUTH':
          return 'Your session has expired. Please sign in again.';
        case 'INSIGHTS_UNAVAILABLE':
          return 'Insights are temporarily unavailable. Please try again later.';
        default:
          return 'Something went wrong. Please try again later.';
      }
    }
  }
})();
