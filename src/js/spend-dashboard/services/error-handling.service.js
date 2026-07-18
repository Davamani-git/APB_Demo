(function() {
  'use strict';

  function ErrorHandlingService(LoggingService) {
    var service = {
      classifyHttpError: classifyHttpError,
      toUserMessage: toUserMessage
    };

    return service;

    function classifyHttpError(response) {
      var status = response && response.status;
      var type = 'UNKNOWN';
      var messageKey = 'generic';
      var recoverable = false;

      if (status === 400) {
        type = 'BAD_REQUEST';
        messageKey = 'invalidRequest';
        recoverable = false;
      } else if (status === 401) {
        type = 'UNAUTHORIZED';
        messageKey = 'unauthorized';
        recoverable = false;
      } else if (status === 403) {
        type = 'FORBIDDEN';
        messageKey = 'forbidden';
        recoverable = false;
      } else if (status === 404) {
        type = 'NOT_FOUND';
        messageKey = 'noData';
        recoverable = true;
      } else if (status >= 500) {
        type = 'SERVER_ERROR';
        messageKey = 'serverError';
        recoverable = true;
      }

      var errorModel = {
        type: type,
        messageKey: messageKey,
        recoverable: recoverable,
        status: status
      };

      LoggingService.error('HTTP error classified', errorModel);

      return errorModel;
    }

    function toUserMessage(errorModel) {
      if (!errorModel) {
        return 'An unexpected error occurred. Please try again later.';
      }

      switch (errorModel.messageKey) {
        case 'invalidRequest':
          return 'The request was invalid. Please refresh the page or contact support if the issue persists.';
        case 'unauthorized':
          return 'Your session has expired or you are not authenticated. Please sign in again.';
        case 'forbidden':
          return 'You are not authorized to view this accounts summary.';
        case 'noData':
          return 'There is no spending activity available for the selected month.';
        case 'serverError':
          return 'We are currently unable to retrieve your summary. Please try again later.';
        default:
          return 'An unexpected error occurred. Please try again later.';
      }
    }
  }

  ErrorHandlingService.$inject = ['LoggingService'];

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();
