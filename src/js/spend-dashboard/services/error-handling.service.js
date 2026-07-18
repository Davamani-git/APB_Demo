(function() {
  'use strict';

  ErrorHandlingService.$inject = ['LoggingService'];

  function ErrorHandlingService(LoggingService) {
    this.classifyHttpError = function(rejection) {
      var status = rejection && rejection.status;
      var type;
      var messageKey;
      var recoverable = false;

      switch (status) {
        case 400:
          type = 'BAD_REQUEST';
          messageKey = 'DAVMS_ERROR_BAD_REQUEST';
          recoverable = false;
          break;
        case 401:
          type = 'UNAUTHORIZED';
          messageKey = 'DAVMS_ERROR_UNAUTHORIZED';
          recoverable = false;
          break;
        case 403:
          type = 'FORBIDDEN';
          messageKey = 'DAVMS_ERROR_FORBIDDEN';
          recoverable = false;
          break;
        case 404:
          type = 'NOT_FOUND';
          messageKey = 'DAVMS_ERROR_NO_DATA';
          recoverable = true;
          break;
        case 500:
        default:
          type = 'SERVER_ERROR';
          messageKey = 'DAVMS_ERROR_SERVER';
          recoverable = true;
          break;
      }

      var errorModel = {
        type: type,
        messageKey: messageKey,
        recoverable: recoverable,
        status: status
      };

      LoggingService.error('HTTP error classified', errorModel);
      return errorModel;
    };

    this.toUserMessage = function(errorModel) {
      if (!errorModel) {
        return 'An unexpected error occurred.';
      }

      switch (errorModel.messageKey) {
        case 'DAVMS_ERROR_BAD_REQUEST':
          return 'We were unable to process your request. Please refresh the page or contact support if the issue persists.';
        case 'DAVMS_ERROR_UNAUTHORIZED':
          return 'Your session has expired or you are not signed in. Please sign in again to view your spending summary.';
        case 'DAVMS_ERROR_FORBIDDEN':
          return 'You are not authorized to view this credit card spending summary.';
        case 'DAVMS_ERROR_NO_DATA':
          return 'There is no spending activity for the selected month.';
        case 'DAVMS_ERROR_SERVER':
        default:
          return 'We are currently unable to retrieve your spending summary. Please try again later.';
      }
    };
  }

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();
