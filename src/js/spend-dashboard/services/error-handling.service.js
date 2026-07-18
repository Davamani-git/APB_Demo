(function() {
  'use strict';

  ErrorHandlingService.$inject = ['LoggingService'];

  function ErrorHandlingService(LoggingService) {
    this.classifyHttpError = function(response) {
      var status = response && response.status;
      var type;
      var messageKey;
      var recoverable = false;

      switch (status) {
        case 400:
          type = 'BAD_REQUEST';
          messageKey = 'error.invalidRequest';
          recoverable = false;
          break;
        case 401:
          type = 'UNAUTHORIZED';
          messageKey = 'error.unauthorized';
          recoverable = false;
          break;
        case 403:
          type = 'FORBIDDEN';
          messageKey = 'error.forbidden';
          recoverable = false;
          break;
        case 404:
          type = 'NOT_FOUND';
          messageKey = 'error.noDataForMonth';
          recoverable = true;
          break;
        case 500:
        default:
          type = 'SERVER_ERROR';
          messageKey = 'error.serverUnavailable';
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
        return 'An unexpected error occurred. Please try again.';
      }

      switch (errorModel.messageKey) {
        case 'error.invalidRequest':
          return 'We were unable to process your request. Please refresh the page or contact support.';
        case 'error.unauthorized':
          return 'Your session has expired or you are not authenticated. Please sign in again.';
        case 'error.forbidden':
          return 'You are not authorized to view this accounts spending summary.';
        case 'error.noDataForMonth':
          return 'There is no spending activity for the selected month.';
        case 'error.serverUnavailable':
        default:
          return 'We are currently unable to retrieve your monthly spending summary. Please try again later.';
      }
    };
  }

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();
