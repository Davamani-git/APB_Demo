(function() {
  'use strict';

  function ErrorHandlingService(LoggingService) {
    var errorMessages = {
      400: 'Invalid request. Please refresh the page or contact support.',
      401: 'Your session has expired. Please log in again.',
      403: 'You are not authorized to view this account\'s summary.',
      404: 'No summary data available for the selected month.',
      500: 'We are currently unable to retrieve your summary. Please try again later.',
      network: 'Network connection error. Please check your connection and try again.',
      timeout: 'Request timed out. Please try again.',
      unknown: 'An unexpected error occurred. Please try again later.'
    };

    function classifyHttpError(response) {
      var errorModel = {
        type: 'unknown',
        messageKey: 'unknown',
        recoverable: false,
        statusCode: null,
        originalError: response
      };

      if (!response) {
        errorModel.type = 'network';
        errorModel.messageKey = 'network';
        errorModel.recoverable = true;
        return errorModel;
      }

      if (response.status) {
        errorModel.statusCode = response.status;
        errorModel.messageKey = response.status.toString();
        
        switch (response.status) {
          case 400:
            errorModel.type = 'client';
            errorModel.recoverable = false;
            break;
          case 401:
            errorModel.type = 'auth';
            errorModel.recoverable = false;
            break;
          case 403:
            errorModel.type = 'auth';
            errorModel.recoverable = false;
            break;
          case 404:
            errorModel.type = 'notFound';
            errorModel.recoverable = true;
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorModel.type = 'server';
            errorModel.recoverable = true;
            break;
          default:
            errorModel.type = 'unknown';
            errorModel.recoverable = true;
        }
      } else if (response.code === 'ECONNABORTED') {
        errorModel.type = 'timeout';
        errorModel.messageKey = 'timeout';
        errorModel.recoverable = true;
      }

      return errorModel;
    }

    function toUserMessage(errorModel) {
      var message = errorMessages[errorModel.messageKey] || errorMessages.unknown;
      
      LoggingService.info('Error classified', {
        type: errorModel.type,
        messageKey: errorModel.messageKey,
        recoverable: errorModel.recoverable,
        statusCode: errorModel.statusCode
      });
      
      return message;
    }

    return {
      classifyHttpError: classifyHttpError,
      toUserMessage: toUserMessage
    };
  }

  ErrorHandlingService.$inject = ['LoggingService'];

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();